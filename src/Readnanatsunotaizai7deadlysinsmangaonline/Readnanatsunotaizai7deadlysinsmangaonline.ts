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
} from './Readnanatsunotaizai7deadlysinsmangaonlineParser'

import {
    resetSettings
} from './Readnanatsunotaizai7deadlysinsmangaonlineSettings'

const READNANATSUNOTAIZAI7DEADLYSINSMANGAONLINE_DOMAIN = 'https://ww7.read7deadlysins.com'

export const Readnanatsunotaizai7deadlysinsmangaonlineInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Read Nanatsu no Taizai 7 Deadly Sins Manga Online',
    icon: 'icon.png',
    author: 'Generated',
    authorWebsite: '',
    description: 'Extension that pulls manga from https://ww7.read7deadlysins.com',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: 'https://ww7.read7deadlysins.com',
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export class Readnanatsunotaizai7deadlysinsmangaonline implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${READNANATSUNOTAIZAI7DEADLYSINSMANGAONLINE_DOMAIN}/`,
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
        return `${READNANATSUNOTAIZAI7DEADLYSINSMANGAONLINE_DOMAIN}/${mangaId}` 
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
