import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Workspace.css";
import ChatWindow from "../chat/ChatWindow.jsx";

const GUTTER_SIZE = 2;
const MIN_TOP_PX = 120;
const MIN_CHAT_PX = 240;

const Workspace = ({ topPanel = null, leftChatProps = {}, rightChatProps = {} }) => {
    const gridRef = useRef(null);

    const [topPx, setTopPx] = useState(220);
    const [leftFr, setLeftFr] = useState(1);
    const [rightFr, setRightFr] = useState(1);

    const dragRef = useRef({
        type: null,
        startX: 0,
        startY: 0,
        startTopPx: 0,
        startLeftFr: 0,
        startRightFr: 0,
        gridW: 0,
        gridH: 0,
    });

    const applyConstraintsRow = useCallback((proposedTopPx) => {
        if (!gridRef.current) return proposedTopPx;
        const { height } = gridRef.current.getBoundingClientRect();
        const minBottomPx = 160;
        const maxTopPx = Math.max(MIN_TOP_PX, height - GUTTER_SIZE - minBottomPx);
        return Math.min(Math.max(proposedTopPx, MIN_TOP_PX), maxTopPx);
    }, []);

    const applyConstraintsCol = useCallback((newLeftFr, newRightFr) => {
        if (!gridRef.current) return [newLeftFr, newRightFr];
        const { width } = gridRef.current.getBoundingClientRect();
        const totalFr = newLeftFr + newRightFr;
        const pxPerFr = (width - GUTTER_SIZE) / totalFr;
        const minFr = MIN_CHAT_PX / pxPerFr;
        const clampedLeft = Math.max(newLeftFr, minFr);
        const remaining = totalFr - clampedLeft;
        const clampedRight = Math.max(remaining, minFr);
        const finalLeft = totalFr - clampedRight;
        return [finalLeft, clampedRight];
    }, []);

    const onRowDown = (e) => {
        const isTouch = e.type === "touchstart";
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        const rect = gridRef.current.getBoundingClientRect();
        dragRef.current = {
            type: "row",
            startX: 0,
            startY: clientY,
            startTopPx: topPx,
            startLeftFr: leftFr,
            startRightFr: rightFr,
            gridW: rect.width,
            gridH: rect.height,
        };
        window.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, { passive: false });
        window.addEventListener(isTouch ? "touchend" : "mouseup", onUp);
    };

    const onColDown = (e) => {
        const isTouch = e.type === "touchstart";
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const rect = gridRef.current.getBoundingClientRect();
        dragRef.current = {
            type: "col",
            startX: clientX,
            startY: 0,
            startTopPx: topPx,
            startLeftFr: leftFr,
            startRightFr: rightFr,
            gridW: rect.width,
            gridH: rect.height,
        };
        window.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, { passive: false });
        window.addEventListener(isTouch ? "touchend" : "mouseup", onUp);
    };

    const onMove = (e) => {
        e.preventDefault();
        const isTouch = e.type === "touchmove";
        const d = dragRef.current;
        if (!d.type) return;
        if (d.type === "row") {
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;
            const dy = clientY - d.startY;
            const nextTop = applyConstraintsRow(d.startTopPx + dy);
            setTopPx(nextTop);
        } else if (d.type === "col") {
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const dx = clientX - d.startX;
            const totalFr = d.startLeftFr + d.startRightFr;
            const pxPerFr = (d.gridW - GUTTER_SIZE) / totalFr;
            const dFr = dx / pxPerFr;
            let newLeft = d.startLeftFr + dFr;
            let newRight = d.startRightFr - dFr;
            const [finalLeft, finalRight] = applyConstraintsCol(newLeft, newRight);
            setLeftFr(finalLeft);
            setRightFr(finalRight);
        }
    };

    const onUp = (e) => {
        const isTouch = e.type === "touchend";
        dragRef.current.type = null;
        window.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
        window.removeEventListener(isTouch ? "touchend" : "mouseup", onUp);
    };

    const hasLeft = !!leftChatProps?.selectedChat;
    const hasRight = !!rightChatProps?.selectedChat;
    const twoChats = hasLeft && hasRight;
    const oneChat = (hasLeft || hasRight) && !twoChats;
    const singleChatProps = hasLeft ? leftChatProps : rightChatProps;

    const gridStyle = {
        gridTemplateRows: `${topPx}px ${GUTTER_SIZE}px 1fr`,
        gridTemplateColumns: twoChats
            ? `${leftFr}fr ${GUTTER_SIZE}px ${rightFr}fr`
            : oneChat
                ? `1fr`
                : `1fr ${GUTTER_SIZE}px 1fr`,
    };

    useEffect(() => {
        const handleResize = () => {
            setTopPx((v) => applyConstraintsRow(v));
            const { width } = gridRef.current?.getBoundingClientRect?.() || { width: 0 };
            if (width) {
                setLeftFr((l) => {
                    const r = rightFr;
                    const [L, R] = (width && applyConstraintsCol(l, r)) || [l, r];
                    setRightFr(R);
                    return L;
                });
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [rightFr, applyConstraintsRow, applyConstraintsCol]);

    return (
        <div className="workspace">
            <div className="workspace-grid" ref={gridRef} style={gridStyle}>
                <div className="workspace-top">
                    {topPanel ?? <div className="top-placeholder">Top Panel</div>}
                </div>

                <div
                    className="gutter gutter-horizontal"
                    onMouseDown={onRowDown}
                    onTouchStart={onRowDown}
                    aria-label="Resize top panel"
                />

                {oneChat ? (
                    <div className="workspace-single">
                        <ChatWindow {...singleChatProps} />
                    </div>
                ) : (
                    <>
                        <div className="workspace-left">
                            {hasLeft ? (
                                <ChatWindow {...leftChatProps} />
                            ) : (
                                <div className="empty-cell">Select a left chat…</div>
                            )}
                        </div>

                        <div
                            className="gutter gutter-vertical"
                            onMouseDown={onColDown}
                            onTouchStart={onColDown}
                            aria-label="Resize chat panels"
                        />

                        <div className="workspace-right">
                            {hasRight ? (
                                <ChatWindow {...rightChatProps} />
                            ) : (
                                <div className="empty-cell">Select a right chat…</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Workspace;
