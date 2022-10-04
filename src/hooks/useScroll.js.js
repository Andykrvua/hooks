import { useEffect, useRef } from 'react';

export default function useScroll(childRef, callback) {
  // observer.current save value when rendering
  // use the state but if you change it there will be a rerender
  const observer = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };
    observer.current = new IntersectionObserver(([target]) => {
      if (target.isIntersecting) {
        console.log('intersected');
        callback();
      }
    }, options);

    observer.current.observe(childRef.current);

    return function () {
      observer.current.unobserve(childRef.current);
    };
  }, [callback]);
}
