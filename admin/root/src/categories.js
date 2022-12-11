'use strict';

const Categories = () => {

    const CAT = [
        {
            "catImage": "https://media.istockphoto.com/id/1297677804/photo/housemaid-cleans-the-table-mop-and-blue-bucket-with-the-detergents-in-the-background.jpg?s=612x612&w=0&k=20&c=RF_e5FgbMRzTRXYJtDMvKa0IsAmbsGkVYST7HkpFL4M=",
            "catTitle": "House Cleaning",
        },
        {
            "catImage": "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/featured-image-hire-an-electrician.jpeg.jpg",
            "catTitle": "Electrical",
        },
        {
            "catImage": "https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg",
            "catTitle": "Plumbing",
        }
    ]  

    const SUBCAT = [
        {
            "subcatImage" : "https://bbcleaningco.com/wp-content/uploads/2020/10/srvc_deepcleaning.jpg",
            "subcatTitle": "Deep Cleaning",
        },
        {
            "subcatImage" : "https://www.cleantechloops.com/wp-content/uploads/2020/11/bathroom-cleaning-issues.jpg",
            "subcatTitle": "Bathroom Cleaning",
        },
        {
            "subcatImage" : "https://cdn.thomasnet.com/insights-images/embedded-images/29ff5157-77a2-43ee-8307-82bbdd208d53/2d87c370-ac29-42f4-b792-67d9dfdeee18/FullHD/best-carpet-cleaning-machine-2021.jpg",
            "subcatTitle": "Carpet Cleaning",
        }
    ]



    const [categories, setCategories] = React.useState([])
    const [subCategories, setSubCategories] = React.useState([])

    const [selectedCategory, setSelectedCategory] = React.useState("")

    const [categoryTitle, setCategoryTitle] = React.useState("")
    const [categoryImage, setCategoryImage] = React.useState("")

    const [subCategoryTitle, setSubCategoryTitle] = React.useState("")
    const [subCategoryImage, setSubCategoryImage] = React.useState("")

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = React.useState(true)
    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = React.useState(false)

    React.useEffect(() => {
        fetchCategories()
    }, []);

    React.useEffect(() => {
        fetchSubCategories()
    }, [selectedCategory]);


    const fetchCategories = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/service-category`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("service categories: ", data)
                setCategories([...data])
            })
        } catch (error) {
            console.log("error fetching categories: ", error)
        }
    }

    const fetchSubCategories = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/service-sub-category`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("service sub-categories: ", data)
                setSubCategories([...data])
            })
        } catch (error) {
            console.log("error fetching categories: ", error)
        }
    }


    const [isSubcatSelected, setSubcatSelected] = React.useState(false)

    const handleShowSubcatSelected = () => {
        setSubcatSelected(true)
    }

    const handleHideSubcatSelected = () => {
        setSubcatSelected(false)
    }

    const handleAddCategory = async () => {
        try {
            // let formdata = 
            await fetch(`https://hanaplingkod.onrender.com/service-category`, {
// 
            })
        } catch (error) {
            console.log("error adding a category: ", error)
        }
    }

    const previewImage = (event) => {
        const imageFiles = event.target.files;
        const imageFilesLength = imageFiles.length;
        
        if (imageFilesLength > 0) {
            // Get the image path.
            const imageSrc = URL.createObjectURL(imageFiles[0]);
            // return(imageSrc)
            // Select the image preview element.
            const imagePreviewElement = document.querySelector("#preview-selected-image");
            // /**
            //  * Assign the path to the image preview element.
            //  */
            imagePreviewElement.src = imageSrc;
            // /**
            //  * Show the element by changing the display value to "block".
            //  */
            imagePreviewElement.style.display = "block";
        }
    };

    return(
        <div>
            <nav class="flexRow">
                <div class="left">
                    <button id="menu-btn" onclick="handleOpenSideNav()">
                        <img id="menu-image" src="./assets/icons/menu.png"/>
                    </button>
            
                    <button class="flexRow" id="logo-btn">
                        <img id="logo-image" src="./assets/logo/logo_icon.png" />
                        <p class="title">HanapLingkod</p>
                    </button>
                </div>
                <div class="right">
                    <a class="home-link" href="#">Home</a>
                    <a class="account-link" href="#">Account</a>
                    <button id="settings-btn">
                        <img id="settings-image" src="./assets/icons/settings.png" />
                    </button>
                </div>
            </nav>
            

            <div class="categories">
                <div class="cat-heading">
                    <h1>Categories</h1>
                    <button type="button" class="add-cat" onClick={() => setIsAddCategoryModalOpen(true)}>Add Category</button>   
                </div>
                
                <div>
                    <div>
                        <table class="category-table">
                            <tr class="cat-tr-title">
                                <th class="cat-th">
                                    <div class="cat-th-img">
                                    <img src="https://img.icons8.com/material-rounded/24/ffffff/opened-folder.png"/>
                                    </div>
                                    <div class="cat-th-title">Category Image</div>
                                </th>
                                <th class="cat-th">
                                    <div class="cat-th-img">
                                        <img src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/18/ffffff/external-online-document-with-title-on-header-template-wireframe-bold-tal-revivo.png"/>
                                    </div>
                                    <div class="cat-th-title">Category Title</div>
                                </th>
                                <th class="cat-th">
                                    <div class="cat-th-img">
                                        <img src="https://img.icons8.com/ios-glyphs/22/ffffff/option.png"/>
                                    </div>
                                    <div class="cat-th-title">Action</div>
                                </th>
                            </tr>
                            {
                                CAT.map(item => (
                                    <tr class="cat-tr-data" 
                                        onClick={() => {
                                            // setSelectedCategory(item.)
                                        }}
                                    >
                                        <td>
                                            <div class="cat-img">
                                                <img src={item.catImage}/>
                                            </div>
                                        </td>
                                        <td className="category-title">{item.catTitle}</td>
                                        <td class="cat-actions">
                                            <button type="button" class="cat-actions-button" onClick={() => handleShowSubcatSelected()}>Select</button>
                                            <button type="button" class="cat-actions-button">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
            
                <div class={isSubcatSelected ? "show-subcat-container" : "hide-subcat-container"}>
                    <div class="subcat-heading">
                        <div class="cat-selected">
                            <h5>Category Selected</h5>
                            <h2>House Cleaning</h2>
                        </div>
                        <button type="button" class="add-subcat">Add Sub-Category</button>   
                    </div>

                    <div>
                        <div>
                            <table>
                                <tr class="subcat-tr-title">
                                    <th class="subcat-th">
                                        <div class="subcat-th-img">
                                            <img src="https://img.icons8.com/windows/26/000000/folder-tree.png"/>
                                        </div>
                                        <div class="subcat-th-title">Category Image</div>
                                    </th>
                                    <th class="subcat-th">
                                        <div class="subcat-th-img">
                                            <img src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/18/000000/external-online-document-with-title-on-header-template-wireframe-bold-tal-revivo.png"/>
                                        </div>
                                        <div class="subcat-th-title">Category Title</div>
                                    </th>
                                    <th class="subcat-th">
                                        <div class="subcat-th-img">
                                            <img src="https://img.icons8.com/ios-glyphs/22/000000/option.png"/>
                                        </div>
                                        <div class="subcat-th-title">Action</div>
                                    </th>
                                </tr>
                                {
                                    SUBCAT.map(item => (
                                        <tr class="subcat-tr-data">
                                            <td>
                                                <div class="subcat-img">
                                                    <img src={item.subcatImage}/>
                                                </div>
                                            </td>
                                            <td>{item.subcatTitle}</td>
                                            <td class="subcat-actions">
                                                <button type="button" class="cat-actions-button">Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </table>
                        </div>
                    </div>
                </div>


                {/* add Category modal */}
                <div class={isAddCategoryModalOpen ? "verify-modal-container show-modal" : "verify-modal-container hide-modal"}>
                    <div class="verify-modal">
                        <h2 class="modal-title">Add Category</h2>
                        
                        <div>
                            <div>
                                <h3>Category Title</h3>
                                <input type="text" placeholder="Enter New Category Title" onChange={(e) => setCategoryTitle(e.target.value)} />
                            </div>
                            <div>
                                <h3>Category Image</h3>
                                <input type="file" id="avatar" name="category-image" accept="image/png, image/jpeg" onChange={previewImage}/>
                            </div>

                            <img src={'./assets/images/placeholder-image.png'} class="categoryChosenImage" id="preview-selected-image"  />
                        </div>

                        <div class="modal-buttons">
                            <button type="button" class="modal-button" id="confirm-verify" onClick={() => handleAddCategory()}>Save Changes</button>
                            <button type="button" class="modal-button modal-button-cancel" onClick={() => handleCloseVerifyModal()}>Discard Changes</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(Categories));