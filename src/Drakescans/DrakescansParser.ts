import {
    Chapter,
    ChapterDetails,
    HomeSection,
    PartialSourceManga,
    PagedResults,
    SourceManga
} from '@paperback/types'

import { Metadata } from './DrakescansHelper'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {
    throw new Error('Not implemented: parseMangaDetails')
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    throw new Error('Not implemented: parseChapters')
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    throw new Error('Not implemented: parseChapterDetails')
}

export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
    throw new Error('Not implemented: parseHomeSections')
}

export const parseViewMore = ($: CheerioStatic, metadata: Metadata | undefined): PagedResults => {
    throw new Error('Not implemented: parseViewMore')
}

export const parseSearch = ($: CheerioStatic, query: string, metadata: Metadata | undefined): PagedResults => {
    throw new Error('Not implemented: parseSearch')
}
