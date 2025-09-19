import {Resend} from 'resend';
import {SENDER_EMAIL, APP_NAME} from '@/lib/constants';
import { Order } from '@/types';
import PurchaseRecieptEmail from './purchase-receipt';

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Inline images as data URIs when possible to improve display in mail clients
// that cannot reach external URLs (e.g. mobile QQ without proxy/VPN).
// We limit inlining to images smaller than `maxInlineBytes` to avoid huge emails.
async function inlineImagesInOrder(order: Order, maxInlineBytes = 500 * 1024) {
    const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '');
    // shallow clone order and its items
    const cloned: Order = { ...order, orderItems: order.orderItems.map(i => ({ ...i })) } as Order;

    const cache = new Map<string, string>();

    for (const item of cloned.orderItems) {
        try {
            let url = item.image || '';
            if (!url) continue;
            // make relative paths absolute
            if (url.startsWith('/')) {
                if (!base) continue; // can't resolve relative without base
                url = `${base}${url}`;
            }

            // only handle http(s) URLs
            if (!/^https?:\/\//i.test(url)) continue;

            if (cache.has(url)) {
                item.image = cache.get(url)!;
                continue;
            }

            const res = await fetch(url);
            if (!res.ok) {
                // keep original url on failure
                cache.set(url, url);
                item.image = url;
                continue;
            }

            // try to determine size; fall back to arrayBuffer length
            const contentLength = res.headers.get('content-length');
            if (contentLength && Number(contentLength) > maxInlineBytes) {
                cache.set(url, url);
                item.image = url;
                continue;
            }

            const arrayBuffer = await res.arrayBuffer();
            if (arrayBuffer.byteLength > maxInlineBytes) {
                cache.set(url, url);
                item.image = url;
                continue;
            }

            const contentType = res.headers.get('content-type') || 'image/jpeg';
            // Buffer is available in Node.js runtime
            const b64 = Buffer.from(arrayBuffer).toString('base64');
            const dataUri = `data:${contentType};base64,${b64}`;
            cache.set(url, dataUri);
            item.image = dataUri;
            } catch (err) {
                // on any error, leave original URL
                console.warn('Failed to inline image for order email:', item.image, err);
            }
    }

    return cloned;
}

export const sendPurchaseReceipt = async ({order}: {order: Order}) => {
    // prepare an order copy where small images are inlined as data URIs
    const orderForEmail = await inlineImagesInOrder(order);

    await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: order.user.email,
        subject: `Order Confirmation - ${order.id}`,
        react: <PurchaseRecieptEmail order={orderForEmail}/>
    });
};
