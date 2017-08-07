function forEach (styleArray, callbackFunc) {
    for (var counter = 0; counter < styleArray.length; counter++) {
        callbackFunc(counter);
    };
};
