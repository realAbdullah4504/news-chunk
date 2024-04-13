export const cat = [
  {
    catName: "General",
    img: require("../assets/img/general-icon.png"),
    img2: require("../assets/img/genral2.png"),
  },
  {
    catName: "Sports",
    img: require("../assets/img/sport-icon.png"),
    img2: require("../assets/img/sport.png"),
  },
  {
    catName: "Lifestyle",
    img: require("../assets/img/lifestyle-icon.png"),
    img2: require("../assets/img/life2.png"),
  },
];
export const companies = [
  {
    name: "BBC News",
    image:require("../assets/img/company/BBC News.png")
  },
  {
    name: "Financial Times",
    image:require("../assets/img/company/Financial Times.png")
  },
  {
    name: "The Economist",
    image:require("../assets/img/company/The Economist.png")
  },
  {
    name: "Sky News",
    image:require("../assets/img/company/Sky News.png")
  },
  {
    name: "ITV News",
    image:require("../assets/img/company/ITV.png")
  },
  {
    name: "The Telegraph",
    image:require("../assets/img/company/The Telegraph.png")
  },
  {
    name: "The Guardian",
    image:require("../assets/img/company/The Guardian.png")
  },
  {
    name: "The Independent",
    image:require("../assets/img/company/The Independent.png")
  },
];

export const subcategoriesList = [
  "Fashion and Style",
  "Health and Medical",
  "Politics and Government",
  "Business and Finance",
  "Climate and Environment",
  "Food and Cooking",
  "Science and Technology",
  "Entertainment and Celebrity News",
  "Travel",
];

export const subCategories = (category) => {
  if (category === "General")
    return [
      {
        name: "Business and Finance",
        image: require("../assets/img/subcategories/briefcase.png"),
        imageFilled: require("../assets/img/subcategories/briefcase_filled.png"),
      },
      {
        name: "Politics and Government",
        image: require("../assets/img/subcategories/government.png"),
        imageFilled: require("../assets/img/subcategories/government_filled.png"),
      },
      {
        name: "Science and Technology",
        image: require("../assets/img/subcategories/atom.png"),
        imageFilled: require("../assets/img/subcategories/atomfilled.png"),
      },
      {
        name: "Health and Medical",
        image: require("../assets/img/subcategories/first-aid-kit.png"),
        imageFilled: require("../assets/img/subcategories/first-aid-kit_filled.png"),
      },
      {
        name: "Crime and Conflict",
        image: require("../assets/img/subcategories/police-handcuffs.png"),
        imageFilled: require("../assets/img/subcategories/police-handcuffs_filled.png"),
      },
      {
        name: "Climate and Environment",
        image: require("../assets/img/subcategories/climate-change.png"),
        imageFilled: require("../assets/img/subcategories/climate-change_filled.png"),
      },
      {
        name: "Entertainment and Celebrity",
        image: require("../assets/img/subcategories/celebrity.png"),
        imageFilled: require("../assets/img/subcategories/celebrity_filled.png"),
      },
    ];
  else if (category === "Sports")
    return [
      {
        name: "Sports",
        image: require("../assets/img/subcategories/sports.png"),
        imageFilled: require("../assets/img/subcategories/sports_filled.png"),
      },
    ];
  else if (category === "Lifestyle")
    return [
      {
        name: "Travel",
        image: require("../assets/img/subcategories/travel-and-tourism.png"),
        imageFilled: require("../assets/img/subcategories/travel-and-tourism-filled.png"),
      },
      {
        name: "Fashion and Style",
        image: require("../assets/img/subcategories/fashion.png"),
        imageFilled: require("../assets/img/subcategories/fashion_filled.png"),
      },
      {
        name: "Food and Cooking",
        image: require("../assets/img/subcategories/bake.png"),
        imageFilled: require("../assets//img/subcategories/bake_filled.png"),
      },
      {
        name: "Arts and Culture",
        image: require("../assets/img/subcategories/art.png"),
        imageFilled: require("../assets/img/subcategories/art_filled.png"),
      },
    ];
};
