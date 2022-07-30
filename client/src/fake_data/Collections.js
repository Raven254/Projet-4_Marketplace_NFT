const product_01 = require('../Images/product_01.jpg').default

const product_02 = require('../Images/product_02.jpg').default

const product_03 = require('../Images/product_03.jpg').default

const product_04 = require('../Images/product_01.jpg').default

const product_05 = require('../Images/product_02.jpg').default

const product_06 = require('../Images/product_03.jpg').default

const product_07 = require('../Images/product_01.jpg').default

const product_08 = require('../Images/product_02.jpg').default

const product_09 = require('../Images/product_03.jpg').default

const product_10 = require('../Images/product_03.jpg').default

const product_11 = require('../Images/product_01.jpg').default

const product_12 = require('../Images/product_02.jpg').default

const collections = [
    {
        title: "Singe",
        id: 1,
        image: product_01,
        colors: ["white", "red", "orange"],
        size: ["s", "m", "l", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "Chat",
        id: 2,
        image: product_02,
        colors: ["white", "red", "blue"],
        size: ["s", "m"],
        description: "Ceci est une collection"
    },
    {
        title: "Maison",
        id: 3,
        image: product_03,
        colors: ["white", "red", "orange", "yellow"],
        size: ["m"],
        description: "Ceci est une collection"
    },
    {
        title: "Hang",
        id: 4,
        image: product_04,
        colors: ["white", "orange", "blue"],
        size: ["xl"],
        description: "Ceci est une collection"
    },
    {
        title: "Charlie",
        id: 18,
        image: product_05,
        colors: ["white", "pink"],
        size: ["xxl"],
        description: "Ceci est une collection"
    },
    {
        title: "Vision",
        id: 5,
        image: product_06,
        colors: ["black"],
        size: ["s", "m", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "Bulbi",
        id: 6,
        image: product_07,
        colors: ["white", "red", "orange", "blue"],
        size: ["l", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "jardi",
        id: 7,
        image: product_08,
        colors: ["white", "red", "black"],
        size: ["s", "m", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "hsgsh",
        id: 8,
        image: product_09,
        colors: ["white", "blue"],
        size: ["m"],
        description: "Ceci est une collection"
    },
    {
        title: "sfghgf",
        id: 9,
        image: product_10,
        colors: ["blue", "black"],
        size: ["l"],
        description: "Ceci est une collection"
    },
    {
        title: "dfhfg",
        id: 10,
        image: product_11,
        colors: ["blue", "black"],
        size: ["s", "m", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "dfgh",
        id: 11,
        image: product_12,
        colors: ["blue"],
        size: ["s", "m", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "fhgfhfd",
        id: 12,
        image: product_01,
        colors: ["white", "red"],
        size: ["s", "m", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "Áo thun Dinosaur 14",
        id: 13,
        image: product_02,
        colors: ["white", "blue"],
        size: ["s", "m"],
        description: "Ceci est une collection"
    },
    {
        title: "Áo thun Dinosaur 15",
        id: 14,
        image: product_03,
        colors: ["red", "blue"],
        size: ["xl"],
        description: "Ceci est une collection"
    },
    {
        title: "Áo somi dài tay 16",
        id: 15,
        image: product_08,
        colors: ["blue", "black"],
        size: ["m", "xl"],
        description: "Ceci est une collection"
    },
    {
        title: "Áo somi tay dài 17",
        id: 16,
        image: product_09,
        colors: ["white", "blue"],
        size: ["s", "l", "xl"],
        description: "Ceci est une collection"
    },
    // 18 products
]

const getAllCollections = () => collections


const collectionData = {
    getAllCollections,
}

export default getAllCollections