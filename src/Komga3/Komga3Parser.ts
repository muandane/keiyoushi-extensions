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

import { Metadata } from './Komga3Helper'

/**
 * Parse manga details from the manga page HTML
 * 
 * Example implementation pattern:
 * - Extract title: $('.manga-title').text().trim()
 * - Extract description: $('.description').text().trim()
 * - Extract author: $('.author').text().trim()
 * - Extract image: $('.cover img').attr('src') ?? ''
 * - Extract status: $('.status').text().trim() (convert to 'Ongoing' or 'Completed')
 * 
 * @param $ - CheerioStatic instance with loaded HTML
 * @param mangaId - The manga ID
 * @returns SourceManga object with parsed details
 */
export const parseMangaDetails = ($: CheerioStatic, mangaId: string): SourceManga => {
    // TODO: Inspect the actual website HTML structure and implement parsing
    // Visit the manga page in a browser, inspect the HTML, and update selectors below
    
    const title = $('h1, .title, .manga-title').first().text().trim() || 'Unknown'
    const description = $('.description, .summary, .synopsis').first().text().trim() || ''
    const author = $('.author, [class*="author"]').first().text().trim() || ''
    const artist = $('.artist, [class*="artist"]').first().text().trim() || ''
    const image = $('.cover img, .thumbnail img, img[class*="cover"]').first().attr('src') || ''
    const statusText = $('.status, [class*="status"]').first().text().trim().toLowerCase()
    const status = statusText.includes('complete') ? 'Completed' : 'Ongoing'
    
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [title],
            image: image,
            status: status,
            author: author,
            artist: artist || author,
            desc: description,
            tags: []
        })
    })
}

/**
 * Parse chapter list from the manga page HTML
 * 
 * Example implementation pattern:
 * - Find chapter container: $('.chapter-list, .chapters')
 * - Loop through chapters: $('.chapter-item').toArray()
 * - Extract chapter ID from link: $('a', chapter).attr('href')?.split('/').pop()
 * - Extract chapter title: $('.chapter-title', chapter).text().trim()
 * - Extract chapter number: parse from title or use index
 * 
 * @param $ - CheerioStatic instance with loaded HTML
 * @param mangaId - The manga ID
 * @returns Array of Chapter objects
 */
export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
    // TODO: Inspect the actual website HTML structure and implement parsing
    // Look for chapter list containers and update selectors below
    
    const chapters: Chapter[] = []
    const chapterElements = $('.chapter-list a, .chapters a, [class*="chapter"] a').toArray()
    
    for (let i = 0; i < chapterElements.length; i++) {
        const element = chapterElements[i]!
        const chapterId = $(element).attr('href')?.replace(/\//g, '').split('/').pop() || `chapter-${i}`
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

/**
 * Parse chapter pages from the chapter reading page HTML
 * 
 * Example implementation patterns:
 * - Image list: $('.page img').map((_, el) => $(el).attr('src')).toArray()
 * - Script-based: Extract image URLs from JavaScript variables
 * - Data attributes: $('[data-src]').map((_, el) => $(el).attr('data-src')).toArray()
 * 
 * @param $ - CheerioStatic instance with loaded HTML
 * @param mangaId - The manga ID
 * @param chapterId - The chapter ID
 * @returns ChapterDetails object with page URLs
 */
export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    // TODO: Inspect the actual website HTML structure and implement parsing
    // Common patterns:
    // 1. Direct img tags: $('.page img, .reader img').map((_, el) => $(el).attr('src'))
    // 2. Data attributes: $('[data-src]').map((_, el) => $(el).attr('data-src'))
    // 3. JavaScript variables: Extract from <script> tags
    
    const pages: string[] = []
    
    // Try common selectors for chapter images
    $('.page img, .reader img, .chapter-content img, [class*="page"] img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src')
        if (src && !src.includes('data:image')) {
            pages.push(src)
        }
    })
    
    // If no pages found, try data attributes
    if (pages.length === 0) {
        $('[data-src]').each((_, el) => {
            const src = $(el).attr('data-src')
            if (src) pages.push(src)
        })
    }
    
    return App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages.length > 0 ? pages : []
    })
}

/**
 * Parse homepage sections (Latest, Popular, etc.)
 * 
 * Example implementation pattern:
 * - Create sections: App.createHomeSection({ id, title, type })
 * - Find manga items: $('.manga-item, .series-item').toArray()
 * - Extract manga info: title, image, mangaId
 * - Call sectionCallback for each section
 * 
 * @param $ - CheerioStatic instance with loaded HTML
 * @param sectionCallback - Callback function to add sections
 */
export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
    // TODO: Inspect the actual website HTML structure and implement parsing
    // Common patterns:
    // - Latest updates section
    // - Popular manga section
    // - New releases section
    
    const latestItems: PartialSourceManga[] = []
    
    // Try common selectors for manga items on homepage
    const mangaElements = $('.manga-item, .series-item, [class*="manga"], [class*="series"]').toArray()
    
    for (const element of mangaElements.slice(0, 20)) { // Limit to 20 items
        const title = $('.title, .name, h3, h4', element).first().text().trim()
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

/**
 * Parse "View More" results for homepage sections
 * 
 * @param $ - CheerioStatic instance with loaded HTML
 * @param homepageSectionId - The section ID (e.g., 'latest', 'popular')
 * @param metadata - Pagination metadata
 * @returns PagedResults with manga items and optional next page metadata
 */
export const parseViewMore = ($: CheerioStatic, homepageSectionId: string, metadata: Metadata | undefined): PagedResults => {
    // TODO: Implement pagination parsing
    // Check if there's a next page button/link
    // Return metadata with next page number if more pages exist
    
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

/**
 * Parse search results
 * 
 * @param $ - CheerioStatic instance with loaded HTML
 * @param query - Search request with title and optional tags
 * @param metadata - Pagination metadata
 * @returns PagedResults with search results and optional next page metadata
 */
export const parseSearch = ($: CheerioStatic, query: SearchRequest, metadata: Metadata | undefined): PagedResults => {
    // TODO: Implement search result parsing
    // Similar to parseViewMore but for search results
    
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
