import { useEffect } from "react";

export default function GoogleAnalytics({trackingId}) {
    useEffect(() => {
        if (!trackingId || window.gtag) return;

        // Load GA script
        const script1 = document.createElement("script");
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        script1.async = true;
        document.head.appendChild(script1);

        // Initialize GA
        const script2 = document.createElement("script");
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}');
        `;
        document.head.appendChild(script2);
    }, [trackingId]);
    return null;
}