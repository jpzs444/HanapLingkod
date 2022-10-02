import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, TouchableOpacity, 
    StatusBar, ScrollView, Modal, BackHandler, Dimensions, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import TText from '../Components/TText'
import Appbar from '../Components/Appbar'
import React, {useEffect, useState} from 'react'

import * as ImagePicker from 'expo-image-picker';
import { ModalPicker } from '../Components/ModalPicker'
import dayjs from 'dayjs';
import { IPAddress } from '../global/global'
import ThemeDefaults from '../Components/ThemeDefaults'

import { useNavigation } from '@react-navigation/native'
import OTPVerification from './OTPVerification'

// import ImageView from "react-native-image-viewing";

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Edit_UserProfile = () => {

    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState(false);
    const [minPriceHigher, setminPriceHigher] = useState(false)
    const [backBtnPressed, setBackBtnPressed] = useState(false)
    const [workList, setWorkList] = useState([])
    const [worksubcat, setWorksubcat] = useState([])

    const [profilePicture, setProfilePicture] = useState("")
    const [pastAppointmentImages, setPastAppointmentImages] = useState([])
    const [pastAppointmentSingleImage, setPastAppointmentSingleImage] = useState("")

    const [prevArrayPrevWorks, setPrevArrayPrevWorks] = useState([])

    const [isImageOpened, setIsImageOpened] = useState(false)

    const [isRemoveUploadedModal, setRemoveUploadedModal] = useState(false)
    const [confirmRemoveUploaded, setConfirmRemoveUploaded] = useState(false)
    const [indexToRemove, setIndexToRemove] = useState("")
    
    const [userEditData, setUserEditData] = useState({
        username: "",
        phonenumber: "",
        street: "",
        purok: "",
        barangay: "",
        bio: "",
    })

    const [userWorkListEdit, setUserWorkListEdit] = useState([])

    const [isModalVisible, setModalVisible] = useState(false)
    const [editHasChanges, setEditHasChanges] = useState(false)
    const [isPickerVisible, setPickerVisible] = useState(false)
    const [appIsSaving, setAppIsSaving] = useState(false)


    let arrayofImages = []

    useEffect(() => {
        console.log("backbtn pressed");
        BackHandler.addEventListener("hardwareBackPress", ()=>handleBackButtonPressed())
        
        // componentwillunmount
        return () => {
          BackHandler.removeEventListener("hardwareBackPress", ()=>handleBackButtonPressed())
        }
    }, []);


    useEffect(() => {
        // reset state on load
        setWorkList([])
        setUserWorkListEdit([])

        fetch("http://" + IPAddress + ":3000/WorkList/" + global.userData._id, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => res.json())
        .then((data) => {
            setWorkList([...data])
            // console.log("minPrice", data[0]._id)
            // console.log("sub_cat: ", data[0].ServiceSubId.ServiceSubCategory)

            for (let i = 0; i < data.length; i++){
                setUserWorkListEdit((prev) => ([...prev, {
                    category: data[i].category,
                    sub_category: `${data[i].ServiceSubId.ServiceSubCategory}`,
                    minPrice: data[i].minPrice,
                    maxPrice: data[i].maxPrice,
                }]))
            }

        }).catch((error) => console.log("workList fetch: ", error.message))
        
        // copyWorkList()

    }, [])


    useEffect(() => {
        setPrevArrayPrevWorks([])

        if(global.userData.prevWorks > 0 && global.userData.role === "worker"){
            // console.log("not null")
            global.userData.prevWorks.map(image => arrayofImages.push(image))
            setPrevArrayPrevWorks([...arrayofImages])
        }
        // console.log(prevArrayPrevWorks)
        // global.userData.prevWorks !== null ? (
        // ) : null
    }, [])


    useEffect(() => {
        (async () => {
          if (Platform.OS !== "web") {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
              // await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              alert("Sorry, we need camera roll permissions to make this work!");
            }
          }
        })();
        
    }, []);


    const handleBackButtonPressed = () => {
        // console.log("worklist: ", workList)
        
        // console.log("gooooooo", editHasChanges)
        setBackBtnPressed(true)
        return true;
        // editHasChanges ? setBackBtnPressed(true) : navigation.navigate("UserProfileScreen")
    }

    const setBarangay = (option) => {
        setUserEditData((prev) => ({...prev, barangay: option}))
        setEditHasChanges(true)
    }

    const changeModalVisibility = (bool) => {
        setModalVisible(bool)
    }

    const changePickerVisibility = (bool) => {
        setPickerVisible(bool)
    }

    const handleAddWorkItem = () => {
        setUserWorkListEdit([...userWorkListEdit, {category: "", sub_category: "", minPrice: "", maxPrice: ""}])
        setEditHasChanges(true)
    }

    const handleRemoveWorkItem = (index) => {
        const list = [...userWorkListEdit];
        // console.log(list)
        list.splice(index, 1);
        setUserWorkListEdit(list)
        // console.log(list)
        setEditHasChanges(true)
    }

    const handleServiceSelect = (val, index) => {
      const list = [...userWorkListEdit];
    //   console.log("val handle service: ", val)

      if(val.sub_category === "unlisted"){
        list[index]['category'] = 'unlisted'
      } else {
        // console.log("val cat: ", val.Category)
  
        list[index]['sub_category'] = val.ServiceSubCategory;
        list[index]['category'] = "";
        setUserWorkListEdit(list)
      }
    //   console.log(workList)
      setEditHasChanges(true)
    }

    const handleSetPrice = (val, index, minMax) => {
        let list = [...userWorkListEdit]

        if(minMax === 'min') list[index]['minPrice'] = val
        else if(minMax === 'max') list[index]['maxPrice'] = val

        list[index]['minPrice'] > list[index]['maxPrice'] ? setminPriceHigher(true) : setminPriceHigher(false)

        list[index]['hasGreaterMin'] = list[index]['minPrice'] > list[index]['maxPrice']

        setUserWorkListEdit(list)
        setEditHasChanges(true)
    }


    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   allowsMultipleSelection: true,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
  
        // console.log("selected", result.selected);
  
        if (!result.cancelled) {
            if(!result.selected){
                setProfilePicture(result.uri)
                // console.log(result.uri)
            }
        }
        // console.log("Image state: ", profilePicture)
        setEditHasChanges(true)
    };

    const pickMultipleImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.5,
        });
  
        // console.log("selected", result.selected);
  
        if (!result.cancelled) {
            if(!result.selected) {
                setPastAppointmentSingleImage(result.uri)
                setPrevArrayPrevWorks([...prevArrayPrevWorks, result.uri])
            }
            else {
                setPastAppointmentImages([...result.selected])
                for(let i = 0; i < result.selected.length; i++){
                    console.log("printf: ", result.selected[i].uri)
                    arrayofImages.push(result.selected[i].uri)
                    // setPrevArrayPrevWorks([...prevArrayPrevWorks, result.selected[i].uri])
                }
                setEditHasChanges(true)
            }
        }

        console.log("arrayofImages from multiselect: ", prevArrayPrevWorks)
        // console.log("Image state: ", pastAppointmentImages)
      };

    const handleRemoveImage = (index) => {
        const list = [...pastAppointmentImages];
        list.splice(index, 1);
        setPastAppointmentImages(list)
        setEditHasChanges(true)
    }

    const handleRemoveUploadedImage = () => {
        const list = [...prevArrayPrevWorks]
        list.splice(indexToRemove, 1)
        setPrevArrayPrevWorks(list)
        setEditHasChanges(true)

        fetch("http://" + IPAddress + ":3000/prevWorks/" + global.userData._id, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "toDelete": prevArrayPrevWorks[indexToRemove],
            })
        }).then((res) => console.log("Deleted Uploaded Image Successfully"))
        .catch((error) => console.log(error.image))

        setRemoveUploadedModal(false)
        // handleRemoveImage(indexToRemove)
    }

    if(appIsSaving){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large' />
            </View>
        )
    }

    const handeRemovePrevWorksImage = () => {

    }


    const saveUserInformation = () => {
        
        setAppIsSaving(true)

        // general user information
        let formData = new FormData()

        // images from past works && new work information | worker route
        let formDataPastWorks = new FormData()

        // Upload images from past appointments | worker
        if(global.userData.role === 'worker'){
            
            if(pastAppointmentSingleImage) {
                let pastImagesURI = pastAppointmentSingleImage;
                let pastImagesFilename = pastImagesURI.split("/").pop();

                // Infer the type of the image
                let match = /\.(\w+)$/.exec(pastImagesFilename);
                let type = match ? `image/${match[1]}` : `image`;

                // console.log("past images solo")
                // upload profile picture
                formDataPastWorks.append("pastWorks", {
                    uri: pastImagesURI,
                    name: pastImagesFilename,
                    type,
                });
            } 
            if (pastAppointmentImages) {
                let prevWorksArray = []
                for(let i = 0; i < pastAppointmentImages.length; i++){
                    let pastImagesURI = pastAppointmentImages[i].uri;
                    let pastImagesFilename = pastImagesURI.split("/").pop();

                    // Infer the type of the image
                    let match = /\.(\w+)$/.exec(pastImagesFilename);
                    let type = match ? `image/${match[1]}` : `image`;

                    prevWorksArray.push({uri: pastImagesURI, name: pastImagesFilename, type,})

                    formDataPastWorks.append("pastWorks", {
                        uri: pastImagesURI,
                        name: pastImagesFilename,
                        type,
                    });

                }

                // upload pasworks images upload by the worker
                fetch("http://" + IPAddress + ":3000/prevWorks/" + global.userData._id, {
                    method: "POST",
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                    body: formDataPastWorks,
                }).then((res) => console.log("successfully uploaded past work images"))
                .catch((error) => console.log(error.message))
            }

            // Upload set of works
            for(let i = 0; i < userWorkListEdit.length; i++){
                fetch("http://" + IPAddress + ":3000/Work", {
                    method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    "Category": userWorkListEdit[i].Category ? 'unlisted' : "",
                    "ServiceSubCategory": userWorkListEdit[i].sub_category,
                    "minPrice": userWorkListEdit[i].minPrice,
                    "maxPrice": userWorkListEdit[i].maxPrice,
                    "userId": global.userData._id,
                }),
                }).then((res) => console.log("successfully added works"))
                .catch((error) => console.log(error.message))
            }
            
            // Update/Upload Works/Services offered by the Worker
            for(let i = 0; i < workList.length; i++){
                fetch("http://" + IPAddress + ":3000/Work/" + workList[i].ServiceSubId.ServiceSubCategory + "/" + workList[i]._id, {
                    method: "DELETE",
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                }).then((res) => console.log("old set of work deleted successfully   ", res.message))
                .catch((error) => console.log(error.message))
            }
            // console.log("Delete fetch")
            
            userEditData.bio ? formData.append("workDescription", userEditData.bio) : null

        }

        // Profile Picture upload
        let profilePic = profilePicture;
        let filename = profilePic.split("/").pop();
        
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // upload profile picture
        if(profilePicture){
            formData.append("profilePic", {
                uri: profilePic,
                name: filename,
                type,
            });
        }

        userEditData.phonenumber ? formData.append("phoneNumber", userEditData.phonenumber) : null
        userEditData.street ? formData.append("street", userEditData.street) : null
        userEditData.purok ? formData.append("purok", userEditData.purok) : null
        userEditData.barangay ? formData.append("barangay", userEditData.barangay) : null
        
        // formData.append("username", global.userData.username)
        // formData.append("firstname", global.userData.firstname)
        // formData.append("lastname", global.userData.lastname)
        // formData.append("middlename", global.userData.middlename)
        // formData.append("birthday", global.userData.birthday)
        // formData.append("age", global.userData.age)
        // formData.append("sex", global.userData.sex)
        // formData.append("city", global.userData.city)
        // formData.append("province", global.userData.province)

        let route = global.userData.role === "recruiter" ? 
            "http://" + IPAddress + ":3000/Recruiter/" + global.userData._id 
            : "http://" + IPAddress + ":3000/Worker/" + global.userData._id 

        // update recruiter and worker profile picture and basic information
        fetch(route, {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
            },
            body: formData,
        }).then((response) => console.log("successfully updated user basic information"))
        .catch((error) => console.log(error.message))


        // navigation.navigate("OTPVScreen", {
        //     phoneNum: userEditData.phonenumber ? userEditData.phonenumber : global.userData.phoneNumber, 
        //     fromEditUserInfo: true,
        //     formDataUserInfo: formData,
        //     formDataPastWorks: formDataPastWorks,
        //     formDataSetOfWorks: formDataSetOfWorks,
        //     workList: workList
        // })


        // update global
        let routeUser = global.userData.role === 'recruiter' ? 'Recruiter' : "Worker"
        fetch("http://" + IPAddress + ":3000/" + routeUser + "/" + global.userData._id, {
            method: "GET",
            header: {
                "conten-type": "application/json"
            },
        }).then((res) => res.json())
        .then((user) => {
            // console.log("user new load: ", route)
            global.userData = user
            // console.log("updated user: ", global.userData)
        })
        .catch((error) => console.log(error.message))

        setBackBtnPressed(false)
        setEditHasChanges(false)
        setAppIsSaving(false)
        navigation.replace("UserProfileScreen")

    }


  return (
    <SafeAreaView style={styles.container}>
        <Modal 
            transparent={true}
            animationType='fade'
            visible={isRemoveUploadedModal}
            onRequestClose={()=> setRemoveUploadedModal(false)}
        >
            <View style={styles.modalUploadedRemoveContainer}>
                <View style={styles.modalURBox}>
                    <View style={styles.modalURTextBox}>
                        <TText style={styles.modalURText}>Are you sure to delete this image?</TText>
                    </View>
                    <View style={styles.modalURBtnBox}>
                        <TouchableOpacity style={[styles.modalURBtn, styles.modalURYesBtn]}
                            onPress={() => {
                                setConfirmRemoveUploaded(true)
                                handleRemoveUploadedImage()
                                setRemoveUploadedModal(false)
                            }}
                        >
                            <TText style={[styles.modalURBtnText, styles.modalURYesText]}>Yes</TText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalURBtn, styles.modalURNoBtn]}
                            onPress={() => setRemoveUploadedModal(false)}
                        >
                            <TText style={styles.modalURBtnText}>No</TText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>


        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 5,}}>
            {/* left */}
            <View style={{flex: 0.5}}>
                <TouchableOpacity style={{justifyContent: 'flex-start'}}
                    onPress={() => {
                        editHasChanges ? setBackBtnPressed(true) : navigation.goBack()
                    }}
                >
                    <Icon name='arrow-left' size={30} />
                </TouchableOpacity>
            </View>

            {/* center */}
            <View style={{flex: 1, alignItems: 'center'}}>
                <Image source={require('../assets/logo/logo_icon.png')} 
                    style={{width: 40, height: 40}} />
            </View>

            {/* right */}
            <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                <TouchableOpacity disabled={!editHasChanges} onPress={()=> setBackBtnPressed(true)} style={{backgroundColor: editHasChanges ? ThemeDefaults.themeDarkBlue : 'lightgray', padding: 4, paddingHorizontal: 10, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                    <View>
                        <View>
                            <TText style={{color: '#fff'}}>Save</TText>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView>
            
            {/* Profile Header | Profile Picture holder */}
            <View style={styles.profileHeader}>
                {/* <Appbar saveBtn={true} hasChanges={editHasChanges} /> */}

                <Modal
                    transparent={true}
                    animationType='fade'
                    visible={backBtnPressed}
                    onRequestClose={()=> setBackBtnPressed(false)}
                >
                    <TouchableOpacity onPress={() => setBackBtnPressed(false)} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <View style={styles.modal_saveChanges}>
                            <View style={styles.modal_textCont}>
                                <TText style={styles.modal_saveText}>Do you want to save your changes?</TText>
                            </View>

                            {/* Buttons */}
                            <View style={styles.modal_btnCont}>
                                <TouchableOpacity onPress={()=> setBackBtnPressed(false) } style={[styles.modal_btn, styles.modal_cancelBtn]}>
                                    <TText style={[styles.modal_btnTxt, styles.modal_btnTxt_cancel]}>Cancel</TText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modal_btn, styles.modal_dontBtn]}
                                    onPress={() => {
                                        setBackBtnPressed(false)    
                                        navigation.goBack()
                                    }}
                                >
                                    <TText style={styles.modal_btnTxt}>Don't Save</TText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modal_btn}
                                    onPress={() => {
                                        setAppIsSaving(true)
                                        saveUserInformation()
                                    }}
                                >
                                    <TText style={styles.modal_btnTxt}>Save</TText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>

                </Modal>

                <View style={{padding: 20, alignItems: 'center'}}>
                    <TText style={{fontSize: 18}}>Edit Profile</TText>
                </View>

                <View style={styles.picturePlaceholder}>
                    <View style={{alignItems: 'center'}}>

                        <Image source={profilePicture ? {uri: profilePicture} : global.userData.profilePic !== "pic" ? {uri: `http://${IPAddress}:3000/images/${global.userData.profilePic}`} : require("../assets/images/default-profile.png")} style={styles.profilePicture} />
                                
                        <TouchableOpacity style={{position:'absolute', bottom: -5, right: 20, backgroundColor: '#fff', borderRadius: 20}}
                            onPress={()=> pickImage()}
                        >
                            <Icon name='pencil-circle' size={30} />
                        </TouchableOpacity>
                    </View>

                    <View style={{alignItems: 'center', marginTop: 18}}>
                        <TText style={{fonFamily: 'LexendDeca_SemiBold', fontSize: 18}}>{global.userData.firstname} {global.userData.lastname}</TText>
                        <TText style={{color: 'gray', marginTop: 3}}>{global.userData.role.charAt(0).toUpperCase() + global.userData.role.slice(1)}</TText>
                    </View>
                </View>
            </View>


            {/* Inputs */}
            <View>
                {/* username & phone number */}
                <View style={styles.rowForm}>
                    <View style={styles.blockContainer}>
                        <TText style={styles.inputLabel}>Username</TText>
                        <View style={styles.textInputContainer}>
                            <TextInput 
                                defaultValue={global.userData.username}
                                style={styles.inputTextInput}
                                editable={false}
                                onChangeText={() => setEditHasChanges(true)}
                            />
                        </View>
                    </View>

                    <View style={styles.blockContainer}>
                        <TText style={styles.inputLabel}>Phone Number</TText>
                        <View style={[styles.textInputContainer, {justifyContent: 'flex-start'}]}>
                            <TText style={{ paddingRight: 5, marginRight: 0}}>+63   |  </TText>
                            <TextInput 
                                defaultValue={global.userData.phoneNumber}
                                placeholder={"9123456789"}
                                style={styles.inputTextInput}
                                onChangeText={(val) => {
                                    setEditHasChanges(true)

                                    setUserEditData((prev) => ({...prev, phonenumber: val}))
                                }}

                            />
                        </View>
                    </View>
                </View>

                {/* street & purok */}
                <View style={styles.rowForm}>
                    <View style={[styles.blockContainer, {width: '56%'}]}>
                        <TText style={styles.inputLabel}>Street</TText>
                        <View style={styles.textInputContainer}>
                            <TextInput 
                                defaultValue={global.userData.street}
                                style={styles.inputTextInput}

                                onChangeText={(val) => {
                                    setEditHasChanges(true)

                                    setUserEditData((prev) => ({...prev, street: val}))
                                }}
                            />
                        </View>
                    </View>

                    <View style={[styles.blockContainer, {width: '40%'}]}>
                        <TText style={styles.inputLabel}>Purok</TText>
                        <View style={styles.textInputContainer}>
                            <TextInput 
                                defaultValue={global.userData.purok}
                                style={styles.inputTextInput}

                                onChangeText={(val) => {
                                    setEditHasChanges(true)

                                    setUserEditData((prev) => ({...prev, purok: val}))
                                }}
                            />
                        </View>
                    </View>
                </View>

                {/* barangay dropdown */}
                <View style={styles.rowForm}>
                    <View style={[styles.blockContainer, {flex: 1}]}>
                        <TText style={styles.inputLabel}>Barangay</TText>
                        <TouchableOpacity style={styles.textInputContainer}
                            onPress={()=> setModalVisible(true)}
                        >
                            <TText style={{marginTop: 5, fontFamily: 'LexendDeca'}}>{ userEditData.barangay ? userEditData.barangay : global.userData.barangay}</TText>

                            <Modal
                            transparent={true}
                            animationType='fade'
                            visible={isModalVisible}
                            onRequestClose={() => setModalVisible(false)}
                            >
                                <ModalPicker 
                                    changeModalVisibility={changeModalVisibility}
                                    setData={setBarangay}
                                    barangay={true}
                                />
                            </Modal>

                            <Icon name="arrow-down-drop-circle" size={20} color={"gray"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* city & province */}
            <View style={styles.rowForm}>
                    <View style={styles.blockContainer}>
                        <TText style={styles.inputLabel}>City</TText>
                        <View style={styles.textInputContainer}>
                            <TextInput 
                                editable={false}
                                defaultValue={global.userData.city}
                                style={{fontSize: 16,}}
                            />
                        </View>
                    </View>

                    <View style={styles.blockContainer}>
                        <TText style={styles.inputLabel}>Province</TText>
                        <View style={styles.textInputContainer}>
                            <TextInput 
                                editable={false}
                                defaultValue={global.userData.province}
                                style={{fontSize: 16,}}
                            />
                        </View>
                    </View>
                </View>

                {/* birthday */}
                <View style={styles.rowForm}>
                    <View style={[styles.blockContainer, {flex: 1}]}>
                        <TText style={styles.inputLabel}>Birthday</TText>
                        <View style={styles.textInputContainer}>
                            <TText style={{marginTop: 5, color: 'lightgray'}}>{dayjs(global.userData.birthday ).format("MMMM D, YYYY")}</TText>
                        </View>
                    </View>
                </View>

                {/* work description */}
                {
                    global.userData.role === 'worker' ?
                        <View style={styles.rowForm}>
                            <View style={[styles.blockContainer, {flex: 1}]}>
                                <TText style={styles.inputLabel}>Work Description</TText>
                                <View style={styles.textInputContainer}>
                                    <TextInput 
                                        defaultValue={global.userData.workDescription}
                                        style={{fontSize: 16,}}
                                        numberOfLines={3}
                                        multiline

                                        onChangeText={(val) => {
                                            setEditHasChanges(true)

                                            setUserEditData((prev) => ({...prev, bio: val}))
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    : null
                }

                {
                    global.userData.role === 'worker' ? 
                        <View style={{marginHorizontal: 30, marginBottom: 30}}>
                            <TText>Images from Previous Appointments</TText>

                            <TouchableOpacity style={{paddingVertical: 40, backgroundColor: '#F4F4F4', marginHorizontal: 20, marginTop: 15, borderRadius: 15, alignItems: 'center', elevation: 4}}
                                onPress={() => pickMultipleImage()}
                            >
                                <Icon name="camera-image" size={50} color={ThemeDefaults.appIcon} />
                                <TText style={{fontSize: 14, color: 'rgba(27, 35, 58, .75'}}>Attach photo(s) here</TText>
                            </TouchableOpacity>
                        </View>
                        : null
                }

                {
                    global.userData.role === 'worker' ?
                        <>
                        {
                            prevArrayPrevWorks.length > 0 ? 
                                <TText style={{marginLeft: 30, marginBottom: 15, fontSize: 20, fontFamily: "LexendDeca"}}>Previous Work Appointment</TText> : null
                        }
                        <ScrollView  horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 35}} style={{paddingHorizontal: 30, marginBottom: 30}} >
                                {
                                    prevArrayPrevWorks.map(function(image, index){
                                        return(
                                            <TouchableOpacity key={index} 
                                            onPress={() => {
                                                // setIsImageOpened(true)
                                                // navigation.navigate("ViewImageScreen", {imageUrl: `http://${IPAddress}:3000/images/${image}`})
                                            }} 
                                            style={{ width: 350, height: 300, maxHeight: 320, backgroundColor: 'pink', elevation: 4, marginRight: 20,}}>
                                                {/* <TText>{index}</TText> */}
                                                <TouchableOpacity style={{backgroundColor: '#fff', borderRadius: 20, position: 'absolute', top: 5, right: 5, zIndex: 5}}
                                                    onPress={()=> {
                                                        // show modal if sure to delete
                                                        setRemoveUploadedModal(true)
                                                        setIndexToRemove(index)
                                                    }}
                                                >
                                                    <Icon name='close-circle' size={28} color={"#FF5353"} />
                                                </TouchableOpacity>
                                                <Image source={{uri: `http://${IPAddress}:3000/images/${image}`}} style={{height: '100%', width: '100%'}} resizeMode="cover" />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                        </ScrollView>
                        
                        {
                            pastAppointmentImages.length > 0 || pastAppointmentSingleImage ? 
                                <TText style={{marginLeft: 30, marginBottom: 15, fontSize: 20, fontFamily: "LexendDeca"}}>New Uploads</TText> : null
                        }
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 35}} style={{paddingHorizontal: 30, marginBottom: 30}}>
                                
                                {
                                    pastAppointmentImages ? pastAppointmentImages.map(function(image, index){
                                        return(
                                            <View key={index + 100} 
                                            style={{ width: image.height > image.width ? 200 : 350, height: 300, backgroundColor: 'pink', elevation: 4, marginRight: 20,  }}>
                                                {/* <TText>{index + 100}</TText> */}
                                                <TouchableOpacity style={{backgroundColor: '#fff', borderRadius: 20, position: 'absolute', top: 5, right: 5, zIndex: 5}}
                                                    onPress={()=> handleRemoveImage(index)}
                                                >
                                                    <Icon name='close-circle' size={28} color={"#FF5353"} />
                                                </TouchableOpacity>
                                                <Image source={{uri: image.uri}} style={{height: '100%', width: '100%'}} resizeMode="cover" />
                                            </View>
                                        )
                                    }) : null
                                }
                                {
                                    pastAppointmentSingleImage ?
                                        <View 
                                        style={{ width: 350, height: 300, backgroundColor: 'pink', elevation: 4, marginRight: 20,  }}>
                                            <TouchableOpacity style={{backgroundColor: '#fff', borderRadius: 20, position: 'absolute', top: 5, right: 5, zIndex: 5}}
                                                onPress={()=> {
                                                    setPastAppointmentSingleImage("")
                                                }}
                                            >
                                                <Icon name='close-circle' size={28} color={"#FF5353"} />
                                            </TouchableOpacity>
                                            <Image source={{uri: pastAppointmentSingleImage}} style={{height: '100%', width: '100%'}} resizeMode="cover" />
                                        </View>
                                    : null
                                }
                        </ScrollView>
                    </>
                        : null
                }


                {/* Works */}
                {
                    global.userData.role === "worker" ?
                        <View style={{marginTop: 30, marginBottom: 150, paddingHorizontal: 30}}>
                            <View style={{flexDirection: 'row', alignContent: 'center',}}>
                                <Icon name="briefcase" size={22} color={ThemeDefaults.themeDarkBlue} />
                                <TText style={{fontSize: 18, marginBottom: 10, marginLeft: 5}}>Services Offered</TText>
                            </View>
                            {
                                userWorkListEdit.map(function (workItem, index) {
                                    return (
                                    <View key={index} style={{marginBottom: 40, }}>
                                        {/* Remove work button */}
                                        {
                                            userWorkListEdit.length > 1 ?
                                                <View style={{alignItems: 'flex-end',  marginTop: 15}}>
                                                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 3, paddingHorizontal: 12, borderWidth: 1.2, borderColor: '#000', borderRadius: 10}}
                                                        onPress={()=> {
                                                            handleRemoveWorkItem(index)
                                                        }}
                                                    >
                                                        <Icon name="close-circle" size={15} color="#000" />
                                                        <TText style={{fontSize: 14, marginLeft: 5}}>Remove Work</TText>
                                                    </TouchableOpacity>
                                                </View>
                                            : null
                                        }

                                        {/* category */}
                                        <View style={[styles.blockContainer, {flex: 1, width: '100%', }]}>
                                            <View>
                                                <TText style={[styles.inputLabel,]}>Work Category</TText>
                                                <TouchableOpacity style={[styles.textInputContainer, {marginTop: 5}]}
                                                    onPress={() => setPickerVisible(true)}
                                                >
                                                    <View style={{flexDirection: 'row', alignContent: 'center', marginTop: 10}}>
                                                        <Icon name='hard-hat' size={22} color={ThemeDefaults.themeOrange} />
                                                        <TText style={{fontSize: 18, marginLeft: 10}}>{ workItem.sub_category ? workItem.sub_category : "Select Work"}</TText>
                                                    </View>
                                                    {/* <TText style={{marginTop: 5,}}>{ workList.service ? "" : workItem.ServiceSubId.ServiceSubCategory}</TText> */}
                                                    <Icon name="arrow-down-drop-circle" size={20} color={"gray"} />
                                                </TouchableOpacity>

                                                <Modal
                                                transparent={true}
                                                animationType='fade'
                                                visible={isPickerVisible}
                                                onRequestClose={() => changePickerVisibility(false)}
                                                >
                                                    <ModalPicker 
                                                        changeModalVisibility={changePickerVisibility}
                                                        setData={(val) => handleServiceSelect(val, index)}
                                                        services={true}
                                                    />
                                                </Modal>
                                            </View>

                                            
                                        </View>

                                        {/* min max Prices */}
                                        <View style={{marginTop: 20}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <View style={[styles.blockContainer, ]}>
                                                    <TText style={styles.inputLabel}>Minimum Price</TText>
                                                    <View style={[styles.textInputContainer, {marginTop: 5, }]}>
                                                    {/* <TText>{workItem.minPrice}</TText> */}
                                                        {/* <Icon name="arrow-down-bold" size={22} color={'red'} /> */}
                                                        <TextInput 
                                                            defaultValue={ workItem.minPrice ? workItem.minPrice.toString() : ""}
                                                            style={{fontSize: 18, width: '90%', paddingTop: 3}}
                                                            keyboardType={"numeric"}
                                                            // onFocus={() => console.log(index)}
                                                            onChangeText={(val) => {
                                                                setEditHasChanges(true)
                                                                handleSetPrice(val, index, "min")
                                                            }}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={[styles.blockContainer, ]}>
                                                    <TText style={styles.inputLabel}>Maximum Price</TText>
                                                    <View style={[styles.textInputContainer, {marginTop: 5}]}>
                                                        {/* <TText>{workItem.minPrice}</TText> */}
                                                        {/* <Icon name="arrow-up-bold" size={22} color={'green'} /> */}
                                                        <TextInput 
                                                            defaultValue={ workItem.maxPrice ? workItem.maxPrice.toString() : ""}
                                                            style={{fontSize: 18, paddingTop: 3, width: '90%'}}
                                                            // value={workItem.minPrice}
                                                            keyboardType={"numeric"}
                                                            // onFocus={() => console.log(index)}
                                                            onChangeText={(val) => {
                                                                setEditHasChanges(true)
                                                                handleSetPrice(val, index, "max")
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            {
                                                workItem['hasGreaterMin'] ? 
                                                    <View style={{marginTop: 10}}>
                                                        <TText style={{color: ThemeDefaults.appIcon}}>Max Price should be higher than Min Price</TText>
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    </View>
                                    )
                                })
                            }

                            {/* Add work button */}
                            <View style={{alignItems: 'center'}}>
                                <TouchableOpacity style={{width: 50, height: 50, borderRadius: 25, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}
                                    onPress={()=> handleAddWorkItem()}
                                >
                                    <Icon name="plus" size={25} color='#fff' />
                                </TouchableOpacity>
                                <View style={{width: 120}}>
                                    <TText style={{textAlign: 'center', fontSize: 14}}>Add another service offered</TText>
                                </View>
                            </View>
                        </View>
                    : null
                }

        </ScrollView>

        {/* {
            imageZoomIn ?
                
        } */}
    </SafeAreaView>
  )
}

export default Edit_UserProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
    },
    profileHeader: {
        // paddingVertical: 50,
        alignItems: 'center',
        // backgroundColor: '#fff',
    },
    picturePlaceholder: {
        paddingTop: 10,
        paddingBottom: 60,

    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: "#000",
        backgroundColor: 'gray'
    },
    rowForm: {
        marginBottom: 30, flexDirection: 'row', width: '100%', paddingHorizontal: 30, justifyContent: 'space-between',
    },
    blockContainer: {
        borderBottomColor: 'gray', borderBottomWidth: 1, paddingBottom: 5, width: "48%"
    },
    textInputContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputLabel: {
        color: '#929292'
    },
    modal_saveChanges: {
        width: WIDTH - 100,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 10,
        backgroundColor: ThemeDefaults.themeLighterBlue,
        overflow: 'hidden',
    },
    modal_textCont: {
        width: '90%',
        paddingVertical: 40,

    },
    modal_saveText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    modal_btnCont: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    modal_btn: {
        paddingHorizontal: 20,
        paddingVertical: 8
    },
    modal_cancelBtn: {

    },
    modal_dontBtn: {
        borderRightWidth: 1.5,
        borderLeftWidth: 1.5,
        borderColor: ThemeDefaults.themeLighterBlue
    },
    modal_btnTxt: {
        fontSize: 18
    },
    modal_btnTxt_cancel: {
        color: '#ff5555'
    },
    modalUploadedRemoveContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalURBox: {
        backgroundColor: ThemeDefaults.appIcon,
        borderRadius: 12,
        borderWidth: 1.2,
        borderColor: ThemeDefaults.appIcon
,        overflow: 'hidden',
        elevation: 4
    },
    modalURTextBox: {
        backgroundColor: ThemeDefaults.themeOrange,
        paddingVertical: 40,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalURText: {
        textAlign: 'center',
        fontSize: 20,
        color: ThemeDefaults.themeWhite,
    },
    modalURBtnBox: {
        flexDirection: 'row',
        backgroundColor: ThemeDefaults.themeWhite,
        justifyContent:'center',
        alignItems: 'center',
        width: '100%',
    },
    modalURBtn: {
        width: '50%',
        alignItems: 'center',
        // paddingHorizontal: 50, 
        // paddingVertical: 15,
    },
    modalURYesBtn: {
        marginVertical: 15,
        borderRightWidth: 1.5,
        borderRightColor: ThemeDefaults.appIcon,
    },
    modalURBtnText: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
    },
    modalURYesText: {
        color: ThemeDefaults.appIcon,
    },
    modalURNoBtn: {

    },
    inputTextInput: {
        width: 120,
        paddingTop: 0,
        // backgroundColor: 'pink',
        fontSize: 16, 
        fontFamily: 'LexendDeca',
    },
})