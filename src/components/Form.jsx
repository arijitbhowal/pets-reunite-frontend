import React, { useState } from "react";
import "./Form.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import GeoCodeForm from "./GeoCodeForm";
import { auth } from "../FirebaseConfig";

const LostPetForm = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    petStatus: "",
    type: "",
    sex: "",
    petName: "",
    lastSeenAdd: "",
    email: "",
    lastSeenDate: "",
    description: "",
    reportImage: null,
    latitude: "",
    longitude: "",
    userId: "",
    userName: "",
    timestamp: "",
  });

  const [errors, setErrors] = useState({});
  const [reportImage, setReportImage] = useState(null);
  const [geoCodeFormVisible, setGeoCodeFormVisible] = useState(false);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      const timestamp = new Date().toISOString();
      const userId = auth.currentUser.uid;
      const userName = auth.currentUser.email;
      const formDataWithTimestamp = {
        ...formData,
        timestamp,
        userId,
        userName,
      };

      const res = await fetch("https://pets-reunite-tgl8.onrender.com/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataWithTimestamp),
      });

      const data = await res.json();

    if (!res.ok) {
      // Check for non-successful response status
      const errorData = await res.json();
      throw new Error(`Server error: ${errorData.message}`);
    }

    console.log("Form submitted successfully");
    history("/search");
  } catch (error) {
    console.error("Error submitting form:", error.message);
    window.alert("Form submission failed");
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "latitude" || name === "longitude") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleGeoCodeForm = () => {
    setGeoCodeFormVisible(!geoCodeFormVisible);
  };

  const renderError = (errorName) => {
    return (
      <span className="report-form__error">
        {errors[errorName] && `This field is required.`}
      </span>
    );
  };

  return (
    <div className="report-pet">
      <div className="nav">
        <Navbar />
      </div>
      <div className="report-form__container">
        <h2 className="report-form__header">
          <AiOutlineFileAdd size={40} className="report-form__header-icon" />
          Report A Pet
        </h2>
        <form
          className="report-form"
          method="POST"
          onSubmit={handleSubmitReport}
          id="report-form"
          encType="multipart/form-data"
        >
          <div className="report-form__status">
            <p className="report-form__label">Pet Status</p>
            <input
              type="radio"
              name="petStatus"
              id="Lost"
              value="Lost"
              className="report-form__radio-input"
              onChange={handleChange}
            />
            <label className="report-form__radio-label report-form__radio-label-tag">
              Lost
            </label>
            <input
              type="radio"
              name="petStatus"
              id="Found"
              value="Found"
              className="report-form__radio-input"
              onChange={handleChange}
            />
            <label className="report-form__radio-label report-form__radio-label-tag">
              Found
            </label>
          </div>
          <div className="report-form__sub-container">
            <div className="report-form__label-set">
              <p className="report-form__label">Type of Pet </p>
              <input
                type="radio"
                name="type"
                onChange={handleChange}
                id="Dog"
                value="Dog"
                className="report-form__radio-input"
              />
              <label className="report-form__radio-label">Dog</label>
              <input
                type="radio"
                name="type"
                onChange={handleChange}
                id="Cat"
                value="Cat"
                className="report-form__radio-input"
              />
              <label className="report-form__radio-label">Cat</label>
            </div>
            <div className="report-form__label-set">
              <p className="report-form__label">Sex </p>
              <input
                type="radio"
                name="sex"
                onChange={handleChange}
                id="Male"
                value="Male"
                className="report-form__radio-input"
              />
              <label className="report-form__radio-label">Male</label>
              <input
                type="radio"
                name="sex"
                onChange={handleChange}
                id="Female"
                value="Female"
                className="report-form__radio-input"
              />
              <label className="report-form__radio-label">Female</label>
            </div>
          </div>
          <div className="report-form__sub-container">
            <label className="report-form__label report-form__label-set">
              Pet Name
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className={
                  !errors.petName
                    ? "report-form__input"
                    : "report-form__input report-form__input--error"
                }
                placeholder="Enter Unknown If You Don't Know the Name"
                onBlur={(e) => {
                  setErrors({ ...errors, petName: e.target.value === "" });
                }}
              />
              {errors.petName && renderError()}
            </label>
            <label className="report-form__label report-form__label-set">
              Last Seen Address
              <input
                name="lastSeenAdd"
                value={formData.lastSeenAdd}
                onChange={handleChange}
                placeholder="Enter the Nearest Address Last Seen"
                className={
                  !errors.lastSeenAdd
                    ? "report-form__input"
                    : "report-form__input report-form__input--error"
                }
                onBlur={(e) => {
                  setErrors({ ...errors, lastSeenAdd: e.target.value === "" });
                }}
              />
              {errors.address && renderError()}
            </label>
          </div>

          <div className="report-form__sub-container">
            <label className="report-form__label report-form__label-set">
              Latitude
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="report-form__input"
              />
            </label>
            <label className="report-form__label report-form__label-set">
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="report-form__input"
              />
            </label>
          </div>
          <p>
            (Use the Geocoder below to get the latitude and longitude of the
            location)
          </p>
          <div className="report-form__sub-container">
            <label className="report-form__label report-form__label-set">
              Contact Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className={
                  !errors.email
                    ? "report-form__input"
                    : "report-form__input report-form__input--error"
                }
                onBlur={(e) => {
                  setErrors({ ...errors, email: e.target.value === "" });
                }}
              />
              {errors.email && renderError()}
            </label>
            <label className="report-form__label report-form__label-set">
              Last Seen Date
              <input
                type="date"
                name="lastSeenDate"
                min="2022-01-01"
                value={formData.lastSeenDate}
                onChange={handleChange}
                className={
                  !errors.lastSeenDate
                    ? "report-form__input"
                    : "report-form__input report-form__input--error"
                }
                onBlur={(e) => {
                  setErrors({ ...errors, lastSeenDate: e.target.value === "" });
                }}
              />
              {errors.date && renderError()}
            </label>
          </div>
          <div className="report-form__sub-container">
            <label className="report-form__label report-form__label-set">
              Description
              <textarea
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="report-form__textarea"
                placeholder="Enter detailed descriptions will boost the reunite chances, e.g. breed, age, color, collar/chip/tattoo..."
              />
            </label>
          </div>
          <div className="report-form__sub-container">
            <label className="report-form__label report-form__label-set">
              Image
              <p className="report-form__note">
                Please upload the pet image url here
              </p>
              <input
                type="text"
                name="reportImage"
                id="reportImage"
                placeholder="Enter the Image URL"
                value={formData.reportImage}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="report-form__button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      {geoCodeFormVisible && <GeoCodeForm />}
      <button
        className="geocode-toggle-button geocode-center-button"
        onClick={toggleGeoCodeForm}
      >
        {geoCodeFormVisible ? "Hide GeoCoder" : "Show GeoCoder"}
      </button>
    </div>
  );
};

export default LostPetForm;
