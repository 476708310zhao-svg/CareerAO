import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | 职引 - 一站式全流程求职辅助平台`;
  }, [title]);
}
