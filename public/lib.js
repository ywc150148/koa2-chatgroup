// 合并数组并去重
function uniqueArr(arr1, arr2) {
    arr1.push(...arr2);
    let arr3 = Array.from(new Set(arr1));
    console.log(arr3)
    return arr3
}

// 去除所有空格: 
function trimAllSpace(str) {
    return str.replace(/\s+/g, "");
}

// 去除左右空格
function trimLRSpace(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

// 删除数组指定元素
function removeArrItem(arr, key) {
    arr.findIndex((value, index) => {
        return value == key && arr.splice(index, 1)
    })
}


module.exports = {
    uniqueArr,
    trimAllSpace,
    trimLRSpace,
    removeArrItem
}