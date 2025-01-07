export const selectText = (e) => {
    const range = document.createRange();
    const selection = window.getSelection();
    
    range.selectNodeContents(e.target);
    selection.removeAllRanges();
    selection.addRange(range);
}

// (숫자) 쉼표 제거
export const unformatNumber = (value) => {
    if(value !== "") {
        return value.replace(/,/g, "");
    }
    return value;
}

// 현재 커서 위치
export const nowCursor = (e) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    return {startOffset, endOffset}
}

// 커서 복구하기
export const restoreCursor = (element, offset) => {
    const selection = window.getSelection();
    const range = document.createRange();

    range.setStart(element.firstChild, offset);
    range.setEnd(element.firstChild, offset);

    selection.removeAllRanges();
    selection.addRange(range);
}