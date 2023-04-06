import { useState, useEffect } from 'react'

export enum EStatus {
  Idle = 'idle',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error'
}

export default function useScript(src: string) {
    const [status, setStatus] = useState(src ? EStatus.Loading : EStatus.Idle);
    
    useEffect(
      () => {
        if (!src) {
          setStatus(EStatus.Idle);
          return;
        }
        let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);
        if (!script) {
          script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.setAttribute("data-status", EStatus.Loading);
          document.body.appendChild(script);
          const setAttributeFromEvent = (event: any) => {
            script!.setAttribute(
              "data-status",
              event.type === "load" ? EStatus.Ready : EStatus.Error
            );
          };
          script.addEventListener("load", setAttributeFromEvent);
          script.addEventListener("error", setAttributeFromEvent);
        } else {
          setStatus((script as any).getAttribute("data-status"));
        }
        const setStateFromEvent = (event: any) => {
          setStatus(event.type === "load" ? EStatus.Ready : EStatus.Error);
        };
        // Add event listeners
        script.addEventListener("load", setStateFromEvent);
        script.addEventListener("error", setStateFromEvent);
        // Remove event listeners on cleanup
        return () => {
          if (script) {
            script.removeEventListener("load", setStateFromEvent);
            script.removeEventListener("error", setStateFromEvent);
          }
        };
      },
      [src] 
    );

    return status;
  }