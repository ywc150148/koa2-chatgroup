let arr1 = [1, 1, 2, 3, 6, 9, 5, 5, 4, "b", "c"]
let arr2 = [1, 2, 5, 4, 9, 7, 7, 8, 8, "a", "b", "c"]

/**
 * uniqueArr(arr1, arr2)
 * 作用：合并数组并去重
 * 注意：new Set()接收一个数组，并且数组中的元素是唯一的。Array.from()能把伪数组转化为真正的数组
 */
function uniqueArr(arr1, arr2) {
    //合并数组 等价 [...arr1,...arr2]
    arr1 = [...arr1, ...arr2];
    console.log("arr1", arr1)
    //去重 等价 [...new Set(arr1)] 
    let arr3 = Array.from(new Set(arr1));
    console.log(arr3)
}


// uniqueArr(arr1, arr2);

// 去除所有空格: 
function trimAllSpace(str) {
    return str.replace(/\s+/g, "");
}

// 去除左右空格
function trimLRSpace(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

// 查找数组元素删除
// let num = ["ahsgsjsj", 999, 777];
// function removeArrItem(arr, key) {
//     arr.findIndex((value, index) => {
//         return value == key && arr.splice(index, 1)
//     })
// }

// removeArrItem(num, 999)
// console.log("num", num)
