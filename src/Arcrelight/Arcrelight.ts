import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ChapterProviding,
    ContentRating,
    DUISection,
    HomePageSectionsProviding,
    HomeSection,
    HomeSectionType,
    MangaProviding,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    SearchResultsProviding,
    SourceInfo,
    SourceIntents,
    SourceManga
} from '@paperback/types'

import {
    parseMangaDetails,
    parseChapters,
    parseChapterDetails,
    parseHomeSections,
    parseViewMore,
    parseSearch
} from './ArcrelightParser'

import {
    resetSettings
} from './ArcrelightSettings'

const ARCRELIGHT_DOMAIN = 'https://arc-relight.com'

export const ArcrelightInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Arc-Relight',
    icon: 'icon.png',
    author: 'Generated',
    authorWebsite: '',
    description: 'Extension that pulls manga from https://arc-relight.com',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: 'https://arc-relight.com',
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export class Arcrelight implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${ARCRELIGHT_DOMAIN}/`,
                        'user-agent': await this.requestManager.getDefaultUserAgent()
                    }
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    });

    stateManager = App.createSourceStateManager()

    async getSourceMenu(): Promise<DUISection> {
        return Promise.resolve(App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            isHidden: false,
            rows: async () => [
                resetSettings(this.stateManager)
            ]
        }))
    }

    getMangaShareUrl(mangaId: string): string { 
        return `${ARCRELIGHT_DOMAIN}/${mangaId}` 
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        return parseMangaDetails(mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        return parseChapters(mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return parseChapterDetails(mangaId, chapterId)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        parseHomeSections(sectionCallback)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        return parseViewMore(metadata)
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        return parseSearch(query.title ?? '', metadata)
    }
}
