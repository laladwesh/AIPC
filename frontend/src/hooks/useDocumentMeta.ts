import { useEffect } from 'react';

interface MetaConfig {
    title: string;
    description: string;
    path: string;
}

const SITE_URL = 'https://iitg.ac.in/aipc';

function setMeta(selector: string, attr: string, value: string) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
}

/**
 * Keeps <title>/meta tags in sync on client-side route changes.
 * The initial HTML response already has route-correct tags injected
 * server-side (see server.js) for crawlers/social previews that don't
 * run JS; this covers navigation within the SPA after that.
 */
export function useDocumentMeta({ title, description, path }: MetaConfig) {
    useEffect(() => {
        const url = `${SITE_URL}${path === '/' ? '' : path}`;

        document.title = title;
        setMeta('meta[name="description"]', 'content', description);
        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[property="og:url"]', 'content', url);
        setMeta('meta[name="twitter:title"]', 'content', title);
        setMeta('meta[name="twitter:description"]', 'content', description);
        setMeta('link[rel="canonical"]', 'href', url);
    }, [title, description, path]);
}
