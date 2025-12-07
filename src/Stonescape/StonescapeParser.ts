import {
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    PartialSourceManga,
    PagedResults,
    SourceManga
} from '@paperback/types'

import { Metadata } from './StonescapeHelper'

export const parseMangaDetails = (mangaId: string): SourceManga => {
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: ['Unknown'],
            image: '',
            status: 'ONGOING',
            author: '',
            artist: '',
            desc: '',
            tags: []
        })
    })
}

export const parseChapters = (mangaId: string): Chapter[] => {
    return []
}

export const parseChapterDetails = (mangaId: string, chapterId: string): ChapterDetails => {
    return App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: []
    })
}

export const parseHomeSections = (sectionCallback: (section: HomeSection) => void): void => {
    const dummyManga = App.createPartialSourceManga({
        image: '',
        title: 'Dummy Manga',
        mangaId: 'dummy-1',
        subtitle: ''
    })
    const section = App.createHomeSection({
        id: 'latest',
        title: 'Latest',
        containsMoreItems: false,
        type: HomeSectionType.singleRowNormal,
        items: [dummyManga]
    })
    sectionCallback(section)
}

export const parseViewMore = (metadata: Metadata | undefined): PagedResults => {
    const dummyManga = App.createPartialSourceManga({
        image: '',
        title: 'Dummy Manga',
        mangaId: 'dummy-1',
        subtitle: ''
    })
    return App.createPagedResults({
        results: [dummyManga],
        metadata: undefined
    })
}

export const parseSearch = (query: string, metadata: Metadata | undefined): PagedResults => {
    const dummyManga = App.createPartialSourceManga({
        image: '',
        title: 'Dummy Manga',
        mangaId: 'dummy-1',
        subtitle: ''
    })
    return App.createPagedResults({
        results: [dummyManga],
        metadata: undefined
    })
}
