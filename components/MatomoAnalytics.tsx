export default function MatomoAnalytics() {
	return (
		<>
			<script
				type='text/javascript'
				dangerouslySetInnerHTML={{
					__html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
              _paq.push(["setCookieDomain", "*.soundingfuture.com"]);
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="https://siacus.at/matomo/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '3']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
				}}
			/>
		</>
	);
}
