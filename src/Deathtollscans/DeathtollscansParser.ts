import {
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    PagedResults,
    SearchRequest,
    SourceManga
} from '@paperback/types'

import { Metadata } from './DeathtollscansHelper'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {
    throw new Error('parseMangaDetails not implemented - parse manga details from the page HTML')
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    throw new Error('parseChapters not implemented - parse chapter list from the page HTML')
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    throw new Error('parseChapterDetails not implemented - parse chapter pages from the page HTML')
}

export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
    throw new Error('parseHomeSections not implemented - parse homepage sections from the page HTML')
}

export const parseViewMore = ($: CheerioStatic, homepageSectionId: string, metadata: Metadata | undefined): PagedResults => {
    throw new Error('parseViewMore not implemented - parse view more results from the page HTML')
}

export const parseSearch = ($: CheerioStatic, query: SearchRequest, metadata: Metadata | undefined): PagedResults => {
    throw new Error('parseSearch not implemented - parse search results from the page HTML')
}
