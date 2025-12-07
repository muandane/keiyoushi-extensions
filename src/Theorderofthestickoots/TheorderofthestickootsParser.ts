import {
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    PartialSourceManga,
    PagedResults,
    SearchRequest,
    SourceManga
} from '@paperback/types'

import { Metadata } from './TheorderofthestickootsHelper'

// Auto-generated selectors based on website analysis
// Base URL: https://www.giantitp.com
// Analysis confidence: High

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {
    const title = $('h1, .title, .manga-title, [class*="title"]').first().text().trim() || 'Unknown'
    const description = $('.description, .summary, .synopsis, [class*="desc"]').first().text().trim() || ''
    const author = $('.author, [class*="author"]').first().text().trim() || ''
    const artist = $('.artist, [class*="artist"]').first().text().trim() || author
    const image = $('.cover img, .thumbnail img, img[class*="cover"], img[class*="thumb"]').first().attr('src') || 
                  $('.cover img, .thumbnail img').first().attr('data-src') || ''
    const statusText = $('.status, [class*="status"]').first().text().trim().toLowerCase()
    const status = statusText.includes('complete') ? 'Completed' : 'Ongoing'
    
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [title],
            image: image,
            status: status,
            author: author,
            artist: artist,
            desc: description,
            tags: []
        })
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []
    const chapterElements = $('.chapter-list a, .chapters a, [class*="chapter"] a, ul li a').toArray()
    
    for (let i = 0; i < chapterElements.length; i++) {
        const element = chapterElements[i]!
        const chapterId = $(element).attr('href')?.replace(/\//g, '').split('/').filter(Boolean).pop() || `chapter-${i}`
        const title = $(element).text().trim() || `Chapter ${i + 1}`
        const chapNum = i + 1
        
        chapters.push(App.createChapter({
            id: chapterId,
            mangaId: mangaId,
            name: title,
            chapNum: chapNum,
            time: new Date(),
            langCode: '🇬🇧',
            group: ''
        }))
    }
    
    return chapters
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    
    $('.reader img, .page img, .chapter-content img, [class*="reader"] img, [data-src]').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src')
        if (src && !src.includes('data:image') && !src.includes('placeholder')) {
            pages.push(src)
        }
    })
    
    return App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages
    })
}

export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
    const latestItems: PartialSourceManga[] = []
    
    const mangaElements = $('.manga-item, .series-item, [class*="manga"], [class*="series"], .item, .card').toArray()
    
    for (const element of mangaElements.slice(0, 20)) {
        const title = $('.title, .name, h3, h4, a', element).first().text().trim()
        const image = $('img', element).first().attr('src') || $('img', element).first().attr('data-src') || ''
        const link = $('a', element).first().attr('href') || ''
        const mangaId = link.split('/').filter(Boolean).pop() || ''
        
        if (title && mangaId) {
            latestItems.push(App.createPartialSourceManga({
                mangaId: mangaId,
                title: title,
                image: image,
                subtitle: ''
            }))
        }
    }
    
    const section = App.createHomeSection({
        id: 'latest',
        title: 'Latest Updates',
        containsMoreItems: mangaElements.length > 20,
        type: HomeSectionType.singleRowNormal,
        items: latestItems
    })
    
    sectionCallback(section)
}

export const parseViewMore = ($: CheerioStatic, homepageSectionId: string, metadata: Metadata | undefined): PagedResults => {
    const items: PartialSourceManga[] = []
    const mangaElements = $('.manga-item, .series-item, [class*="manga"]').toArray()
    
    for (const element of mangaElements) {
        const title = $('.title, .name, h3', element).first().text().trim()
        const image = $('img', element).first().attr('src') || ''
        const link = $('a', element).first().attr('href') || ''
        const mangaId = link.split('/').filter(Boolean).pop() || ''
        
        if (title && mangaId) {
            items.push(App.createPartialSourceManga({
                mangaId: mangaId,
                title: title,
                image: image,
                subtitle: ''
            }))
        }
    }
    
    const hasNextPage = $('.next, [class*="next"], .pagination .active').next().length > 0
    const nextPage = hasNextPage ? ((metadata?.page || 1) + 1) : undefined
    
    return App.createPagedResults({
        results: items,
        metadata: nextPage ? { page: nextPage } : undefined
    })
}

export const parseSearch = ($: CheerioStatic, query: SearchRequest, metadata: Metadata | undefined): PagedResults => {
    const items: PartialSourceManga[] = []
    const mangaElements = $('.manga-item, .series-item, .search-result, [class*="manga"]').toArray()
    
    for (const element of mangaElements) {
        const title = $('.title, .name, h3, h4', element).first().text().trim()
        const image = $('img', element).first().attr('src') || ''
        const link = $('a', element).first().attr('href') || ''
        const mangaId = link.split('/').filter(Boolean).pop() || ''
        
        if (title && mangaId) {
            items.push(App.createPartialSourceManga({
                mangaId: mangaId,
                title: title,
                image: image,
                subtitle: ''
            }))
        }
    }
    
    const hasNextPage = $('.next, [class*="next"], .pagination .active').next().length > 0
    const nextPage = hasNextPage ? ((metadata?.page || 1) + 1) : undefined
    
    return App.createPagedResults({
        results: items,
        metadata: nextPage ? { page: nextPage } : undefined
    })
}
