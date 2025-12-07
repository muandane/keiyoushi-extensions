import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ChapterProviding,
    ContentRating,
    DUISection,
    HomePageSectionsProviding,
    HomeSection,
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
} from './ResetscansParser'

import {
    resetSettings
} from './ResetscansSettings'

const RESETSCANS_DOMAIN = 'https://reset-scans.org'

export const ResetscansInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Reset Scans',
    icon: 'icon.png',
    author: 'Generated',
    authorWebsite: '',
    description: 'Extension that pulls manga from https://reset-scans.org',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: 'https://reset-scans.org',
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export class Resetscans implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${RESETSCANS_DOMAIN}/`,
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
        return `${RESETSCANS_DOMAIN}/${mangaId}` 
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        throw new Error('Not implemented: getMangaDetails')
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        throw new Error('Not implemented: getChapters')
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        throw new Error('Not implemented: getChapterDetails')
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        throw new Error('Not implemented: getHomePageSections')
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        throw new Error('Not implemented: getViewMoreItems')
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        throw new Error('Not implemented: getSearchResults')
    }
}
