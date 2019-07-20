import {parse} from "./grammar.js";
import { useRef } from "react";
export const createAnimation = (update, timing, duration) => () => {
	const start = +new Date();
	let cancel = false;
	const animate = () => {
		const current = +new Date(),
			dt = current - start;
		cancel = cancel || dt > duration;
		if (!cancel) requestAnimationFrame(animate);
		update(timing(dt / duration));
		// cancel = !update(timing(dt / duration));
	};
	animate();
};

export const useScroll = (timing, duration) => {
	const ref = useRef(null);
	const executeScroll = () => {
		const currentScroll = window.scrollY;
		// let currentlyScrolling
		// let overrideScrolling = false;
		// let l = window.addEventListener("scroll", () => {
		//   overrideScrolling = !currentlyScrolling;
		//   window.removeEventListener("scroll", l);
		//   currentlyScrolling = false;
		// })
		createAnimation(
			t => {
				// currentlyScrolling = true;
				window.scrollTo(
					0,
					currentScroll + (ref.current.offsetTop - currentScroll) * t
				);
				// return !overrideScrolling;
			},
			timing,
			duration
		)();
	};
	const htmlElementAttributes = { ref };
	return [executeScroll, htmlElementAttributes];
};

export const parseExpr = parse;
export const getDataUrl = img => {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // If the image is not png, the format
  // must be specified here
  return canvas.toDataURL();
}

export const randomize = a => a.sort((a, b) => ~~(Math.random() > 0.5) - 1);
export const group = (a, p) => a.sort((a, b) => (p(a) ? -1 : 1));
export const memoize1 = f => {
	let mem = new Map();
	return v => {
		if (mem.has(v)) return mem.get(v);
		let temp = f(v);
		mem.set(v, temp);
		return temp;
	};
};
