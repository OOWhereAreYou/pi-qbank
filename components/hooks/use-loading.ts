"use client";

import { useEffect, useRef, useState } from "react";

// 动画样式类型
export type LoadingStyle = "triangle" | "square" | undefined;

export const useLoading = (
  _style: "triangle" | "square" | undefined = "triangle"
) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);
  const [loadingStyle, setLoadingStyle] = useState<LoadingStyle>("triangle");
  const loadingDivRef = useRef<HTMLDivElement | null>(null);
  const styleElementRef = useRef<HTMLStyleElement | null>(null);

  // 创建 loading 元素
  useEffect(() => {
    if (loading) {
      // 检测当前是否为暗色模式
      const isDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // 根据模式设置颜色
      const backgroundColor = isDarkMode
        ? "rgba(18, 18, 18, 0.7)"
        : "rgba(255, 255, 255, 0.7)";
      const textColor = isDarkMode ? "#F9FAFB" : "#171717";

      // 设计规范中的颜色
      const primaryColor = isDarkMode ? "#60A5FA" : "#3B82F6"; // 强调色
      const secondaryColor = isDarkMode ? "#F9FAFB" : "#171717"; // 文本色/主色
      const tertiaryColor = isDarkMode ? "#10B981" : "#10B981"; // 成功色

      const loadingDiv = document.createElement("div");
      loadingDiv.id = "global-loading";
      loadingDiv.style.position = "fixed";
      loadingDiv.style.top = "0";
      loadingDiv.style.left = "0";
      loadingDiv.style.width = "100%";
      loadingDiv.style.height = "100%";
      loadingDiv.style.backgroundColor = backgroundColor;
      loadingDiv.style.display = "flex";
      loadingDiv.style.flexDirection = "column";
      loadingDiv.style.alignItems = "center";
      loadingDiv.style.justifyContent = "center";
      loadingDiv.style.zIndex = "9999";

      // 创建 loader 元素
      const loader = document.createElement("div");
      loader.className = "loader";

      // 根据样式类型设置不同的动画
      let styleContent = "";
      if (loadingStyle === "triangle") {
        // 三角形旋转样式
        loader.style.height = "60px";
        loader.style.aspectRatio = "0.866";
        loader.style.display = "grid";
        loader.style.background = `conic-gradient(from -121deg at right, #0000, ${primaryColor} 1deg 60deg, #0000 61deg)`;
        loader.style.animation = "loaderTriangleRotate 2s infinite linear";
        loader.style.transformOrigin = "33% 50%";

        styleContent = `
          #global-loading .loader:before,
          #global-loading .loader:after {
            content: "";
            grid-area: 1/1;
            transform-origin: inherit;
            animation: inherit;
          }
          
          #global-loading .loader:before {
            background: conic-gradient(from -121deg at right, #0000, ${secondaryColor} 1deg 60deg, #0000 61deg);
          }
          
          #global-loading .loader:after {
            background: conic-gradient(from -121deg at right, #0000, ${tertiaryColor} 1deg 60deg, #0000 61deg);
            animation-duration: 3s;
          }
          
          @keyframes loaderTriangleRotate {
            100% { transform: rotate(1turn) }
          }
        `;
      } else if (loadingStyle === "square") {
        // 方块旋转样式
        loader.style.width = "30px";
        loader.style.aspectRatio = "1";
        loader.style.background = primaryColor;
        loader.style.display = "grid";
        loader.style.animation = "loaderSquare0 1s infinite linear";

        styleContent = `
          #global-loading .loader::before,
          #global-loading .loader::after {
            content: "";
            grid-area: 1/1;
            background: ${secondaryColor};
            animation: inherit;
            animation-name: loaderSquare1;
          }
          
          #global-loading .loader::after {
            background: ${tertiaryColor};
            --s: 60deg;
          }
          
          @keyframes loaderSquare0 {
            0%,20% {transform: rotate(0)}
            100%   {transform: rotate(90deg)}
          }
          
          @keyframes loaderSquare1 {
            50% {transform: rotate(var(--s,30deg))}
            100% {transform: rotate(0)}
          }
        `;
      }

      // 创建样式元素
      const styleElement = document.createElement("style");
      styleElement.textContent = styleContent;
      document.head.appendChild(styleElement);
      styleElementRef.current = styleElement;

      loadingDiv.appendChild(loader);

      // 如果有文本，添加文本元素
      if (loadingText) {
        const textDiv = document.createElement("div");
        textDiv.textContent = loadingText;
        textDiv.style.marginTop = "24px";
        textDiv.style.color = textColor;
        textDiv.style.fontSize = "16px";
        textDiv.style.fontFamily = "Arial, Helvetica, sans-serif";
        loadingDiv.appendChild(textDiv);
      }

      document.body.appendChild(loadingDiv);
      document.body.style.overflow = "hidden";

      // 保存引用以便稍后清理
      loadingDivRef.current = loadingDiv;

      // 监听系统主题变化
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const handleDarkModeChange = (e: MediaQueryListEvent) => {
        if (loadingDivRef.current) {
          const isDark = e.matches;

          // 更新背景色
          loadingDivRef.current.style.backgroundColor = isDark
            ? "rgba(18, 18, 18, 0.7)"
            : "rgba(255, 255, 255, 0.7)";

          // 更新加载动画颜色 - 需要移除并重新创建
          cleanupLoading();
          setLoading(true);

          // 更新文本颜色
          if (loadingText) {
            const textElement =
              loadingDivRef.current.querySelector("div:nth-child(2)");
            if (textElement instanceof HTMLElement) {
              textElement.style.color = isDark ? "#F9FAFB" : "#171717";
            }
          }
        }
      };

      darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

      return () => {
        darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
        cleanupLoading();
      };
    }
  }, [loading, loadingText, loadingStyle]);

  // 清理 loading 元素的函数
  const cleanupLoading = () => {
    if (
      loadingDivRef.current &&
      document.body.contains(loadingDivRef.current)
    ) {
      document.body.removeChild(loadingDivRef.current);
      loadingDivRef.current = null;
    }

    if (
      styleElementRef.current &&
      document.head.contains(styleElementRef.current)
    ) {
      document.head.removeChild(styleElementRef.current);
      styleElementRef.current = null;
    }

    document.body.style.overflow = "";
  };

  const startLoading = (text?: string, style?: LoadingStyle) => {
    setLoadingStyle(style || _style || "triangle");
    setLoadingText(text);
    setLoading(true);
  };

  const endLoading = () => {
    // 立即清理 DOM 元素
    cleanupLoading();
    // 然后更新状态
    setLoading(false);
    setLoadingText(undefined);
  };

  return {
    loading,
    startLoading,
    endLoading,
  };
};

export default useLoading;
