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
    const [asd, setAsd] = React.useState({})

    const [selectedCategory, setSelectedCategory] = React.useState("")

    const [categoryTitle, setCategoryTitle] = React.useState("")
    const [categoryImage, setCategoryImage] = React.useState("")

    const [subCategoryTitle, setSubCategoryTitle] = React.useState("")
    const [subCategoryImage, setSubCategoryImage] = React.useState("")
    
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = React.useState(false)
    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = React.useState(false)
    const [isCategorySelectOpen, setIsCategorySelectOpen] = React.useState(false)
    const [categorySelected, setCategorySelected] = React.useState({})
    const [categoryListed, setCategoryListed] = React.useState("")

    const [isSubcatSelected, setSubcatSelected] = React.useState(false)

    const [newCategoryTitle, setNewCategoryTitle] = React.useState("")
    const [categoryAddImage, setCategoryAddImage] = React.useState({})
    const [categorySelectedAddSubCat, setCategorySelectedAddSubCat] = React.useState("")

    // const [addSubCategoryModalOpen, setEditSubCategoryModalOpen] = React.useState(false)

    const [editCategoryModalOpen, setEditCategoryModalOpen] = React.useState(false)
    const [editSubCategoryModalOpen, setEditSubCategoryModalOpen] = React.useState(false)

    const [subCatSelected, setSubCatSelected] = React.useState({})

    const [sideNavOpen, setSideNavOpen] = React.useState(false)


    React.useEffect(() => {
        fetchCategories()
    }, []);



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


    const fetchSubCategories = async (selected) => {
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
                let list  = data.filter(e => e.ServiceID._id === selected._id)
                console.log(list)
                setSubCategories([...list])


            })
        } catch (error) {
            console.log("error fetching categories: ", error)
        }
    }



    const handleShowSubcatSelected = (item) => {
        setSubcatSelected(true)
        setCategorySelected(item)
        setAsd(item)
        fetchSubCategories(item)

        window.location.href="#link_sub-category-table"
    }

    const handleShowEditCategory = (item) => {
        setCategorySelected(item)
        setNewCategoryTitle(item.Category)
        setCategoryAddImage(item.image)
        setEditCategoryModalOpen(true)
        // fetchSubCategories(item)
    }

    // discard|close add sub-cat modal
    const handleDiscardAddSubCategory = () => {
        setNewCategoryTitle("")
        setCategoryAddImage({})
        setCategorySelectedAddSubCat("")

        setEditSubCategoryModalOpen(false)
    }

    const handleHideSubcatSelected = () => {
        setSubcatSelected(false)
    }

    const handleOpenEditModalSubCat = (item) => {
        console.log("open edit sub-cat edit: ", item)
        setNewCategoryTitle(item.ServiceSubCategory)
        setSubCatSelected(item._id)
        setCategoryListed(item.ServiceID.Category)
        setCategorySelectedAddSubCat(item._id)
        setCategoryAddImage(item.image)

        setEditSubCategoryModalOpen(true)
    }

    const previewImage = (event) => {
        const imageFiles = event.target.files;
        const imageFilesLength = imageFiles.length;
        
        if (imageFilesLength > 0) {
            // Get the image path.
            const imageSrc = URL.createObjectURL(imageFiles[0]);
            console.log("data type of imageFiles: ", imageFiles[0])
            setCategoryAddImage(imageFiles[0])

            const imagePreviewElement = document.querySelector("#preview-selected-image");
            imagePreviewElement.src = imageSrc;
            imagePreviewElement.style.display = "block";
        }
    };

    const previewImageSubCat = (event) => {
        const imageFiles = event.target.files;
        const imageFilesLength = imageFiles.length;
        
        if (imageFilesLength > 0) {
            // Get the image path.
            const imageSrc = URL.createObjectURL(imageFiles[0]);
            console.log("imagefile: ", imageFiles)
            setCategoryAddImage(imageFiles[0])

            const imagePreviewElement = document.querySelector("#preview-selected-image-subcat");
            imagePreviewElement.src = imageSrc;
            imagePreviewElement.style.display = "block";
        }
    };

    const previewEditCatImage = (event) => {
        const imageFiles = event.target.files;
        const imageFilesLength = imageFiles.length;
        
        if (imageFilesLength > 0) {
            // Get the image path.
            const imageSrc = URL.createObjectURL(imageFiles[0]);
            console.log("imagefile: ", imageFiles)
            setCategoryAddImage(imageFiles[0])

            const imagePreviewElement = document.querySelector("#preview-selected-image-edit-cat");
            imagePreviewElement.src = imageSrc;
            imagePreviewElement.style.display = "block";
        }
    };

    const previewImageEditSubCat = (event) => {
        const imageFiles = event.target.files;
        const imageFilesLength = imageFiles.length;
        
        if (imageFilesLength > 0) {
            // Get the image path.
            const imageSrc = URL.createObjectURL(imageFiles[0]);
            console.log("imagefile: ", imageFiles)
            setCategoryAddImage(imageFiles[0])

            const imagePreviewElement = document.querySelector("#preview-selected-image-edit-subcat");
            imagePreviewElement.src = imageSrc;
            imagePreviewElement.style.display = "block";
        }
    };

    const handleOnSelectedCategoryListed = (item) => {
        setCategoryListed(item.Category)
        setIsCategorySelectOpen(false)
        setAsd(item)
        console.log(item._id)
        setCategorySelectedAddSubCat(item._id)
    }

    const handleLogout = () => {
        sessionStorage.removeItem("adminAccessToken")
        sessionStorage.removeItem("adminUsername")
        sessionStorage.removeItem("adminId")
        sessionStorage.removeItem("viewUserProfile_role")
        sessionStorage.removeItem("viewUserProfile_Id")
        sessionStorage.removeItem("selectedReportItem")

        window.location.assign("./index.html")
    }

    //  Add New Category
    const handleAddCategory = async () => {
        try {
            console.log("handleAddCategory")
            let formdata = new FormData()

            formdata.append("image", categoryAddImage)
            formdata.append("Category", newCategoryTitle)

            await fetch(`https://hanaplingkod.onrender.com/service-category`, {
                method: "POST",
                headers: {
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                },
                body: formdata
            })

            setNewCategoryTitle("")
            setCategoryAddImage({})
            setIsAddCategoryModalOpen(false)

            fetchCategories()
        } catch (error) {
            console.log("error adding a category: ", error)
        }
    }

    // Update Category Title or Image
    const handleUpdateCategory = async () => {
        try {
            console.log("handleUpdateCategory")
            let formData = new FormData()

            // formData.append("Category", newCategoryTitle)
            formData.append("image", categoryAddImage)

            await fetch(`https://hanaplingkod.onrender.com/service-category/${categorySelected._id}`, {
                method: "PUT",
                headers: {
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                },
                body: formData
            })

            setNewCategoryTitle("")
            setCategoryAddImage({})

            fetchCategories()
            setEditCategoryModalOpen(false)

        } catch (error) {
            console.log("error update category: ", error)
        }
    }


    const handleCloseAddSubCat = () => {
        setIsAddSubCategoryModalOpen(false)
    }


    // add Sub-Category
    const handleAddSubCategory = async () => {
        try {
            console.log("handleAddCategory")
            let formdata = new FormData()

            // ategorySelectedAddSubCat
            formdata.append("ServiceID", categorySelectedAddSubCat)
            // formdata.append("image", categoryAddImage)
            formdata.append("subCategory", newCategoryTitle)

            console.log("cat id: ", categorySelectedAddSubCat)
            console.log("image selected: ", categoryAddImage)
            console.log("new title: ", newCategoryTitle)

            await fetch(`https://hanaplingkod.onrender.com/service-sub-category`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                },
                body: JSON.stringify({
                    ServiceID: categorySelectedAddSubCat,
                    ServiceSubCategory: newCategoryTitle,
                })
            })
            // .then(res => res.json())
            .then(() => {
                console.log("added sub-category")
            })

            setNewCategoryTitle("")
            setCategoryAddImage({})
            setCategorySelectedAddSubCat("")

            setIsAddSubCategoryModalOpen(false)
            setCategorySelected(asd)
            fetchSubCategories(asd)
        } catch (error) {
            console.log("error adding a category: ", error)
        }
    }

    // edit/update Sub-Category
    const handleUpdateSubCategory = async () => {
        try {
            console.log("handleAddCategory")
            let formdata = new FormData()

            formdata.append("image", categoryAddImage)

            await fetch(`https://hanaplingkod.onrender.com/service-sub-category/${subCatSelected}`, {
                method: "PUT",
                headers: {
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                },
                body: formdata
            })

            setNewCategoryTitle("")
            setCategoryAddImage({})
            setCategorySelectedAddSubCat("")

            setEditSubCategoryModalOpen(false)

            // fetchCategories()
            fetchSubCategories(categorySelected)
        } catch (error) {
            console.log("error adding a category: ", error)
        }
    }

    return(
        <div>
            <nav class="flexRow">
                <div class="left">
                    <button id="menu-btn" onClick={() => setSideNavOpen(prev => !prev)}>
                        <img id="menu-image" src="./assets/icons/menu.png"/>
                    </button>
            
                    <button class="flexRow" id="logo-btn" onClick={() => window.location.href='Home.html'}>
                        <img id="logo-image" src="./assets/logo/logo_icon.png" />
                        <p class="title">HanapLingkod</p>
                    </button>
                </div>
                <div class="right">
                    <a class="home-link" href="./Home.html">Home</a>
                    <button id="settings-btn" onClick={() => handleLogout()}>
                        <img class={"popup-option-icon"} src="./assets/icons/logout.png" />
                        <p>Logout</p>
                    </button>
                </div>
            </nav>

            <div class={sideNavOpen ? "side-navigation-open" : "side-navigation"}>
                <div class="close-btn-div">
                    <button id="close-side-menu" onClick={() => setSideNavOpen(prev => !prev)}>
                        <img class="arrow-left-menu" src="./assets/icons/arrow-left-long.png" />
                    </button>
                </div>

                <div class="side-nav-menu">
                    <div class="menu flexRow" onClick={() => window.location.href='Home.html'}>
                        <img class="menu-icon" src="./assets/icons/home.png" />
                        <p class="menu-text">Home</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='UsersView.html'}>
                        <img class="menu-icon" src="./assets/icons/people.png" />
                        <p class="menu-text">View Users</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='AccountVerification.html'}>
                        <img class="menu-icon" src="./assets/icons/verification.png" />
                        <p class="menu-text">User Verification</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='UserReports.html'}>
                        <img class="menu-icon" src="./assets/icons/reports.png" />
                        <p class="menu-text">User Reports</p>
                    </div>

                    <div class="menu flexRow side-navigation-active-page" onClick={() => window.location.href='Categories.html'}>
                        <img class="menu-icon" src="./assets/icons/category.png" />
                        <p class="menu-text">Add/Modify Category</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='signup.html'}>
                        <img class="menu-icon" src="./assets/icons/account.png" />
                        <p class="menu-text">Create Account</p>
                    </div>

                    {/* <div class="menu flexRow" onClick={() => window.location.href='Transactions.html'}>
                        <img class="menu-icon" src="./assets/icons/transaction-gray.png" />
                        <p class="menu-text">Transaction</p>
                    </div> */}
                </div>
            </div>
            

            <div class="categories">
                <div class="cat-heading">
                    <h1>Categories</h1>
                    <div>
                        <button type="button" class="add-cat" onClick={() => setIsAddCategoryModalOpen(true)}>Add Category</button>   
                        <button type="button" class="add-subcat" onClick={() => setIsAddSubCategoryModalOpen(true)}>Add Sub-Category</button>   
                    </div>
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
                                categories.map(item => (
                                    <tr class="cat-tr-data" 
                                        onClick={() => {
                                            // setSelectedCategory(item.)
                                        }}
                                    >
                                        <td>
                                            <div class="cat-img">
                                                <img src={item.image}/>
                                            </div>
                                        </td>
                                        <td className="category-title">{item.Category}</td>
                                        <td class="cat-actions">
                                            <button type="button" class="cat-actions-button" onClick={() => handleShowSubcatSelected(item)}>Select</button>
                                            <button type="button" class="cat-actions-button" onClick={() => handleShowEditCategory(item)}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
            
                {/* sub-category table */}
                <div class={isSubcatSelected ? "show-subcat-container" : "hide-subcat-container"} id={"link_sub-category-table"}>
                    <div class="subcat-heading">
                        <div class="cat-selected">
                            <h5>Category Selected</h5>
                            <h2>{categorySelected.Category}</h2>
                        </div>
                        <button type="button" class="add-subcat" onClick={() => setIsAddSubCategoryModalOpen(true)}>Add Sub-Category</button>   
                    </div>

                    <div>
                        <div>
                            <table class={"sub-category-big-table"}>
                                <tr class="subcat-tr-title">
                                    <th class="subcat-th">
                                        <div class="subcat-th-img">
                                            <img src="https://img.icons8.com/windows/26/000000/folder-tree.png"/>
                                        </div>
                                        <div class="subcat-th-title">Sub-Category Image</div>
                                    </th>
                                    <th class="subcat-th">
                                        <div class="subcat-th-img">
                                            <img src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/18/000000/external-online-document-with-title-on-header-template-wireframe-bold-tal-revivo.png"/>
                                        </div>
                                        <div class="subcat-th-title">Sub-Category Title</div>
                                    </th>
                                    <th class="subcat-th">
                                        <div class="subcat-th-img">
                                            <img src="https://img.icons8.com/ios-glyphs/22/000000/option.png"/>
                                        </div>
                                        <div class="subcat-th-title">Action</div>
                                    </th>
                                </tr>
                                {
                                    subCategories.map(item => (
                                        <tr class="subcat-tr-data">
                                            <td>
                                                <div class="subcat-img">
                                                    <img src={item.image}/>
                                                </div>
                                            </td>
                                            <td>{item.ServiceSubCategory}</td>
                                            <td class="subcat-actions">
                                                <button type="button" class="cat-actions-button" onClick={() => handleOpenEditModalSubCat(item)}>Edit</button>
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
                                <input type="text" placeholder="Enter New Category Title" onChange={(e) => setNewCategoryTitle(e.target.value)} />
                                
                            </div>
                            <div>
                                <h3>Category Image</h3>
                                <input type="file" id="avatar" name="category-image" accept=".png, .jpg, .jpeg" onChange={previewImage}/>
                            </div>

                            <img src={'./assets/images/placeholder-image.png'} class="categoryChosenImage" id="preview-selected-image"  />
                        </div>

                        <div class="modal-buttons">
                            <button type="button" class="modal-button" id="confirm-verify" onClick={() => handleAddCategory()}>Save Changes</button>
                            <button type="button" class="modal-button modal-button-cancel" onClick={() => setIsAddCategoryModalOpen(false)}>Discard Changes</button>
                        </div>
                    </div>
                </div>

                {/* edit/updated Category modal */}
                <div class={editCategoryModalOpen ? "verify-modal-container show-modal" : "verify-modal-container hide-modal"}>
                    <div class={"verify-modal modal-edit-category-container"}>
                        <h2 class="modal-title">Edit Category</h2>
                        
                        {/* <div class={"delete-button-container"}>
                            <button><img src="./assets/icons/trash.png" /></button>
                        </div> */}
                        <div >
                            <div>
                                <h3>Category Title</h3>
                                <p class={"category-title-edit-modal"}>{categorySelected.Category}</p>
                                {/* <input type="text" placeholder="Enter Category Title" value={newCategoryTitle ? newCategoryTitle : ""} onChange={(e) => setNewCategoryTitle(e.target.value)} /> */}
                            </div>
                            <div>
                                <h3>Category Image</h3>
                                <p class={"replace-image-subtitle"}>Replace Category Image</p>
                                <input type="file" id="avatar" name="category-image" accept=".png, .jpg, .jpeg" onChange={previewEditCatImage}/>
                            </div>

                            <img src={categorySelected.image} class="categoryChosenImage" id="preview-selected-image-edit-cat"  />
                        </div>

                        <div class="modal-buttons">
                            <button type="button" class="modal-button" id="confirm-verify" onClick={() => handleUpdateCategory()}>Save Changes</button>
                            <button type="button" class="modal-button modal-button-cancel" onClick={() => setEditCategoryModalOpen(false)}>Discard Changes</button>
                        </div>
                    </div>
                </div>


                {/* add Sub-Category modal */}
                <div class={isAddSubCategoryModalOpen ? "verify-modal-container show-modal" : "verify-modal-container hide-modal"}>
                    <div class="verify-modal">
                        <h2 class="modal-title">Add Sub-Category</h2>
                        
                        <div class={"subcat-modal-view"}>
                            <div class={"select-category-container"}>
                                <h3>Category Listed</h3>
                                {/* <input type="text" placeholder="Enter New Category Title" onChange={(e) => setCategoryTitle(e.target.value)} /> */}
                                <button class={"select-category-button"} onClick={() => setIsCategorySelectOpen(prev => !prev)}>{categoryListed ? categoryListed : "Select Category"}  <img class={"button-icon-down"} src={isCategorySelectOpen ? "./assets/icons/chevron-up.png" : "./assets/icons/chevron-down.png"} /></button>
                            
                                {
                                    isCategorySelectOpen &&
                                    <div id="category-select-menu">
                                        {
                                            categories.map(item => (
                                                <button class={"category-option"} onClick={() => handleOnSelectedCategoryListed(item)}>{item.Category}</button>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                            <div>
                                <h3>Sub-Category Title</h3>
                                <input type="text" placeholder="Enter New Category Title" onChange={(e) => setNewCategoryTitle(e.target.value)} />
                            </div>
                            {/* <div>
                                <h3>Sub-Category Image</h3>
                                <input type="file" id="avatar" name="category-image" accept="image/png, image/jpeg" onChange={previewImageSubCat}/>
                            </div> */}

                            {/* <img src={'./assets/images/placeholder-image.png'} class="categoryChosenImage" id="preview-selected-image-subcat"  /> */}
                        </div>

                        <div class="modal-buttons">
                            <button type="button" class="modal-button" id="confirm-verify" onClick={() => handleAddSubCategory()}>Save Changes</button>
                            <button type="button" class="modal-button modal-button-cancel" onClick={() => handleCloseAddSubCat()}>Discard Changes</button>
                        </div>
                    </div>
                </div>


                {/* edit sub-category */}
                <div class={editSubCategoryModalOpen ? "verify-modal-container show-modal" : "verify-modal-container hide-modal"}>
                    <div class="verify-modal">
                        <h2 class="modal-title">Edit Sub-Category</h2>
                        
                        <div class={"subcat-modal-view"}>
                                <h3>Category Listed</h3>
                                {
                                    categoryListed === 'unlisted' ?
                                    <>
                                        {
                                            isCategorySelectOpen &&
                                            <div id="category-select-menu">
                                                {
                                                    categories.map(item => (
                                                        <button class={"category-option"} onClick={() => handleOnSelectedCategoryListed(item)}>{item.Category}</button>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </>
                                    :
                                    <p class={"category-listed-category-title"}>{categoryListed}</p>
                                }
                                
                                <h3>Sub-Category Title</h3>
                                    <p class={"category-title-edit-modal"}>{newCategoryTitle}</p>
                            <div>
                                    {/* <p class={"category-title-edit-modal"}>{newCategoryTitle}</p> */}
                                
                            </div>
                            <div>
                                <h3>Sub-Category Image</h3>
                                <input type="file" id="avatar" name="category-image" accept="image/png, image/jpeg" onChange={previewImageEditSubCat}/>
                            </div>

                            <img src={'./assets/images/placeholder-image.png'} class="categoryChosenImage" id="preview-selected-image-edit-subcat"  />
                        </div>

                        <div class="modal-buttons">
                            <button type="button" class="modal-button" id="confirm-verify" onClick={() => handleUpdateSubCategory()}>Save Changes</button>
                            <button type="button" class="modal-button modal-button-cancel" onClick={() => handleDiscardAddSubCategory()}>Discard Changes</button>
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