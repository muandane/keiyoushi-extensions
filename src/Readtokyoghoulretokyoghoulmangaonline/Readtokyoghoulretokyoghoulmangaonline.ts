import {
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
} from './ReadtokyoghoulretokyoghoulmangaonlineParser'

import {
    resetSettings
} from './ReadtokyoghoulretokyoghoulmangaonlineSettings'

const READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN = 'https://ww11.tokyoghoulre.com'

export const ReadtokyoghoulretokyoghoulmangaonlineInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Read Tokyo Ghoul Re & Tokyo Ghoul Manga Online',
    icon: 'icon.png',
    author: 'Generated',
    authorWebsite: '',
    description: 'Extension that pulls manga from Read Tokyo Ghoul Re & Tokyo Ghoul Manga Online',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export class Readtokyoghoulretokyoghoulmangaonline implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/`,
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
        return App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            isHidden: false,
            rows: async () => [
                resetSettings(this.stateManager)
            ]
        })
    }

    getMangaShareUrl(mangaId: string): string { 
        return `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/${mangaId}` 
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/${chapterId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseChapterDetails($, mangaId, chapterId)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const request = App.createRequest({
            url: READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        parseHomeSections($, sectionCallback)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const request = App.createRequest({
            url: `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/${homepageSectionId}?page=${page}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseViewMore($, homepageSectionId, metadata)
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const searchQuery = encodeURIComponent(query.title ?? '')
        const request = App.createRequest({
            url: `${READTOKYOGHOULRETOKYOGHOULMANGAONLINE_DOMAIN}/search?q=${searchQuery}&page=${page}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseSearch($, query, metadata)
    }
}
