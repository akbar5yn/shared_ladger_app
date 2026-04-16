// composables/useDrawerUI.ts
export const useDrawerUI = () => {
    const currentTop = ref(500);
    const isDragging = ref(false);
    const isMounted = ref(false);
    const isSpendingLocked = ref(false);
    const startY = ref(0);
    const startTop = ref(0);
    const limits = reactive({ min: 80, max: 500 });
    const initialHeight = ref(0);
    const route = useRoute();
    let globalObserver: ResizeObserver | null = null;

    const updatePositions = () => {
        const h = initialHeight.value || window.innerHeight;
        const headerEl = document.getElementById("main-header");
        const mainSlot = document.getElementById("main-slot");
        const navWrapper = document.getElementById("navigation-wrapper");
        const contentContainer = document.getElementById("content-container");
        const cursorGrab = document.getElementById("cursor-grab");

        if (headerEl) limits.min = headerEl.getBoundingClientRect().bottom + 10;

        let safeZone = h - 100;
        if (navWrapper) {
            const bottomInset = 16;
            const drawerHandleHeight = cursorGrab?.getBoundingClientRect().height ?? 0;
            safeZone = window.innerHeight - drawerHandleHeight - bottomInset;
        }

        if (mainSlot) {
            const spendingBottom = Math.floor(mainSlot.getBoundingClientRect().bottom);
            limits.max = spendingBottom > safeZone ? safeZone : spendingBottom;

            if (spendingBottom && navWrapper && cursorGrab && contentContainer) {
                const navHeight = navWrapper.getBoundingClientRect().height;
                const cursorGrabH = cursorGrab.getBoundingClientRect().height;
                const stopTop = h - (navHeight + cursorGrabH);

                if (spendingBottom >= stopTop) {
                    limits.max = stopTop;
                    if (!isSpendingLocked.value) {
                        let margin = 0;
                        if (route.name === "dashboard") {
                            margin = 24;
                        }
                        const maxHeight =
                            stopTop - contentContainer.getBoundingClientRect().top - margin;
                        contentContainer.style.maxHeight = `${maxHeight}px`;
                        contentContainer.style.overflow = "scroll";
                        isSpendingLocked.value = true;
                    }
                } else {
                    if (isSpendingLocked.value) {
                        mainSlot.style.maxHeight = "";
                        mainSlot.style.overflow = "";
                        isSpendingLocked.value = false;
                    }
                }
            }
        }
        currentTop.value = limits.max;
    };

    const onTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        if (!touch) return;
        isDragging.value = true;
        startY.value = touch.clientY;
        startTop.value = currentTop.value;
    };

    const onTouchMove = (e: TouchEvent) => {
        if (!isDragging.value) return;
        const touch = e.touches[0];
        if (!touch) return;
        const deltaY = touch.clientY - startY.value;
        const newTop = startTop.value + deltaY;
        if (newTop >= limits.min && newTop <= limits.max) currentTop.value = newTop;
    };

    const onTouchEnd = () => {
        isDragging.value = false;
        const mid = (limits.min + limits.max) / 2;
        currentTop.value = currentTop.value < mid ? limits.min : limits.max;
    };

    const initObserver = () => {
        if (globalObserver) globalObserver.disconnect();
        const mainSlot = document.getElementById("main-slot");
        if (mainSlot) {
            globalObserver = new ResizeObserver(() => updatePositions());
            globalObserver.observe(mainSlot);
        }
    };

    return { currentTop, isDragging, isMounted, onTouchStart, onTouchMove, onTouchEnd, updatePositions, initialHeight, isSpendingLocked, initObserver };
};