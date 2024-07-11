import { Drawer } from "vaul";

import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Field,
  Label,
  Select,
  Input,
  Textarea,
  ComboboxButton,
  ComboboxInput,
  Combobox,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import clsx from "clsx";
import { app } from "../firebase";
import { toast } from "react-toastify";

import { LinkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

// import components

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(undefined);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const [open, setOpen] = React.useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        setImageUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePhoto: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        toast.error(error.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("User updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error));
      toast.error(error.message);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setImage(droppedFile);
  };

  const handleFileInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmitClose = () => {
    handleSubmit();
    setOpen(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="rounded-xl w-full flex justify-center items-center gap-x-1 p-2 text-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          <PencilSquareIcon className="size-6" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-200 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-3xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-t-3xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium text-center">
                Edit profile
              </Drawer.Title>
              <div className="mt-4">
                <form
                  onSubmit={(handleSubmit) => {
                    wait().then(() => setOpen(false));
                    handleSubmit.preventDefault();
                  }}
                  className="w-full flex flex-col gap-2"
                >
                  <div
                    className={`w-full py-4 border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center ${
                      dragging ? "bg-gray-100" : ""
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current.click()}
                  >
                    <input
                      id="profile-photo-input"
                      type="file"
                      ref={fileRef}
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <img
                      src={formData.profilePhoto || currentUser.profilePhoto}
                      alt="profile"
                      className="rounded-full h-24 w-24 object-cover cursor-pointer self-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
                    <div className="text-center mt-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        {dragging
                          ? "Drop the image here"
                          : "Drag & drop image here, or click to select"}
                      </p>
                    </div>
                    <p className="text-sm self-center">
                      {imageUploadError ? (
                        <span className="text-red-700">
                          Error Image upload (image must be less than 2 mb)
                        </span>
                      ) : imageUploadProgress > 0 &&
                        imageUploadProgress < 100 ? (
                        <span className="text-slate-700">{`Uploading ${imageUploadProgress}%`}</span>
                      ) : imageUploadProgress === 100 ? (
                        <span className="text-green-700">
                          Image successfully uploaded!
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Field>
                      <Label
                        className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1"
                        htmlFor="username"
                      >
                        Username
                      </Label>
                      <Input
                        defaultValue={currentUser.username}
                        type="text"
                        id="username"
                        placeholder="Your name"
                        className={clsx(
                          "block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500"
                        )}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                  <div className="w-full">
                    <Field>
                      <Label
                        className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1"
                        htmlFor="email"
                      >
                        E-mail
                      </Label>
                      <Input
                        defaultValue={currentUser.email}
                        type="text"
                        id="email"
                        placeholder="Email"
                        className={clsx(
                          "block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500"
                        )}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-indigo-500 px-3.5 py-2.5 text-md font-semibold text-indigo-500 shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      type="button"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-500 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      onClick={handleSubmitClose}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default EditProfile;
