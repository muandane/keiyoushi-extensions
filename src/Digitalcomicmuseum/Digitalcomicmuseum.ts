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
} from './DigitalcomicmuseumParser'

import {
    resetSettings
} from './DigitalcomicmuseumSettings'

const DIGITALCOMICMUSEUM_DOMAIN = 'https://digitalcomicmuseum.com'

export const DigitalcomicmuseumInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Digital Comic Museum',
    icon: 'icon.png',
    author: 'Generated',
    authorWebsite: '',
    description: 'Extension that pulls manga from https://digitalcomicmuseum.com',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: 'https://digitalcomicmuseum.com',
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export class Digitalcomicmuseum implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${DIGITALCOMICMUSEUM_DOMAIN}/`,
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
        return `${DIGITALCOMICMUSEUM_DOMAIN}/${mangaId}` 
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
