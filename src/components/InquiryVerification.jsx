import { useEffect, useRef, useState } from 'react';

let scriptPromise;
function loadTurnstile() {
  if (window.turnstile?.render) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      scriptPromise = undefined;
      reject(new Error('Verification unavailable'));
    };
    const timeout = setTimeout(fail, 10_000);
    script.onload = () => {
      clearTimeout(timeout);
      if (window.turnstile?.render) resolve(window.turnstile);
      else fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export default function InquiryVerification({ siteKey, onToken, resetKey }) {
  const container = useRef(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let disposed = false;
    let api;
    let widget;
    setFailed(false);
    onToken('');
    const clearToken = () => { if (!disposed) onToken(''); };
    const fail = () => { if (!disposed) { onToken(''); setFailed(true); } };
    loadTurnstile().then(turnstile => {
      if (disposed) return;
      api = turnstile;
      widget = api.render(container.current, {
        sitekey: siteKey, action: 'inquiry', size: 'flexible', theme: 'light',
        callback: token => { if (!disposed) { setFailed(false); onToken(token); } },
        'expired-callback': clearToken, 'error-callback': fail, 'timeout-callback': fail
      });
    }).catch(fail);
    return () => {
      disposed = true;
      if (widget !== undefined) api.remove(widget);
    };
  }, [siteKey, onToken, resetKey, attempt]);

  return <div className="field">
    <div ref={container} />
    {failed && <div className="form-note" role="alert">
      Verification is unavailable. Retry or use the direct email link below.
      {' '}<button type="button" className="btn btn--ghost" onClick={() => setAttempt(value => value + 1)}>Retry verification</button>
    </div>}
  </div>;
}
