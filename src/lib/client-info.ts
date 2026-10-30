import type { Context } from 'hono'
import Bowser from 'bowser'

export function getClientIp(c: Context): string | null {
    const forwarded = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    return forwarded || c.req.header('x-real-ip')?.trim() || null
}

const COUNTRY_CODE = /^[A-Z]{2}$/
const UNKNOWN_COUNTRIES = new Set(['XX', 'T1'])

function safeDecode(value: string): string {
    try {
        return decodeURIComponent(value)
    } catch {
        return value
    }
}

export function getGeo(c: Context): { country: string | null; city: string | null } {
    const rawCountry = (c.req.header('x-vercel-ip-country') ?? c.req.header('cf-ipcountry'))
        ?.trim()
        .toUpperCase()

    const rawCity = c.req.header('x-vercel-ip-city')?.trim()

    return {
        country:
            rawCountry && COUNTRY_CODE.test(rawCountry) && !UNKNOWN_COUNTRIES.has(rawCountry)
                ? rawCountry
                : null,
        city: rawCity ? safeDecode(rawCity) : null
    }
}

const MAX_UA_LENGTH = 512

export function getAgent(c: Context): {
    browser: string | null
    browserVersion: string | null
    os: string | null
    osVersion: string | null
    device: string | null
} {
    const ua = c.req.header('user-agent')?.slice(0, MAX_UA_LENGTH)

    if (!ua) {
        return { browser: null, browserVersion: null, os: null, osVersion: null, device: null }
    }

    const parsed = Bowser.parse(ua)

    return {
        browser: parsed.browser.name ?? null,
        browserVersion: parsed.browser.version ?? null,
        os: parsed.os.name ?? null,
        osVersion: parsed.os.version ?? null,
        device: parsed.platform.type ?? null
    }
}
