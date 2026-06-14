import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});
