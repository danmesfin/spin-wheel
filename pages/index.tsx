import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinwheel from "./components/spin-wheel";

const initialFormValues = {
  email: "",
  phone: "",
  checkbox: false,
};

const mockApiCall = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const offers = [
  {
    id: 1,
    title: "50% off",
    code: "HALFOFF",
  },
  {
    id: 2,
    title: "Free Shipping",
    code: "FREESHIP",
  },
  {
    id: 3,
    title: "$10 Gift Card",
    code: "GIFTCARD10",
  },
];

const SpinWheel = ({ onSpin }) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const spinWheel = () => {
    setSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * offers.length);
      setSelectedOffer(offers[randomIndex]);
      setSpinning(false);
      onSpin(offers[randomIndex]);
    }, 3000);
  };

  return (
    <div className="relative w-80 h-80">
      <div
        className={`absolute inset-0 bg-center bg-no-repeat bg-contain ${
          spinning ? "animate-spin" : ""
        }`}
        style={{
          backgroundImage: `url('/spin-wheel.png')`,
        }}
      ></div>
      <button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-green-600 text-white rounded-full"
        disabled={spinning}
        onClick={spinWheel}
      >
        Spin
      </button>
      {selectedOffer && (
        <div className="absolute bottom-0 w-full text-center font-bold text-xl">
          Congratulations! You won {selectedOffer.title}
          <br />
          Your code is {selectedOffer.code}
          <br />
          <button
            className="px-2 py-1 mt-2 bg-gray-200 rounded"
            onClick={() => navigator.clipboard.writeText(selectedOffer.code)}
          >
            Copy code
          </button>
        </div>
      )}
    </div>
  );
};

const InitialScreen = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await mockApiCall();
      onSubmit();
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Try your luck!</h1>
        <Formik
          initialValues={initialFormValues}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            phone: Yup.string()
              .matches(/^\d+$/, "Invalid phone number")
              .required("Required"),
            checkbox: Yup.bool().oneOf(
              [true],
              "You must accept the terms and conditions"
            ),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block font-bold mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border rounded py-2 px-3"
                />
                <ErrorMessage
                  name="email"
                  className="text-red-500"
                  component="p"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block font-bold mb-1">
                  Phone Number
                </label>
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  className="w-full border rounded py-2 px-3"
                />
                <ErrorMessage
                  name="phone"
                  className="text-red-500"
                  component="p"
                />
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="checkbox"
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">
                    I agree to receiving recurring automated messages at the
                    number I have provided. Consent is not a condition to
                    purchase.
                  </span>
                </label>
                <ErrorMessage
                  name="checkbox"
                  className="text-red-500"
                  component="p"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white rounded-full py-2 px-4 w-full"
                disabled={isSubmitting || loading}
              >
                {loading ? "Loading..." : "Try your luck!"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const GamePageScreen = ({ onSpin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Spin the wheel!</h1>
        <SpinWheel onSpin={onSpin} />
      </div>
    </div>
  );
};

const FinalRewardScreen = ({ reward, onClose }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Congratulations!
        </h1>
        <p className="text-xl text-center">You won {reward.title}</p>
        <div className="flex flex-row justify-center items-center mt-4">
          <div className="bg-gray-200 rounded p-4 mr-4">{reward.code}</div>
          <button
            className="bg-green-600 text-white rounded py-2 px-4"
            onClick={() => {
              navigator.clipboard.writeText(reward.code);
            }}
          >
            Copy
          </button>
        </div>
        <button
          type="button"
          className="bg-green-600 text-white rounded-full py-2 px-4 mt-4 w-full"
          onClick={onClose}
        >
          Close Panel and Copy
        </button>
      </div>
    </div>
  );
};

function App() {
  const [currentScreen, setCurrentScreen] = useState("initial");
  const [reward, setReward] = useState(null);

  const handleInitialSubmit = () => {
    setCurrentScreen("game");
  };

  const handleSpin = (offer) => {
    setReward(offer);
    setCurrentScreen("reward");
  };

  return (
    <div className="App bg-green-200">
      <div className="flex gap-4 flex-wrap md:flex-nowrap justify-center">
        <div className="w-96 h-96">
          <Spinwheel />
        </div>

        {currentScreen === "initial" && (
          <InitialScreen onSubmit={handleInitialSubmit} />
        )}
        {currentScreen === "game" && <GamePageScreen onSpin={handleSpin} />}
        {currentScreen === "reward" && (
          <FinalRewardScreen
            reward={reward}
            onClose={() => setCurrentScreen("initial")}
          />
        )}
      </div>
    </div>
  );
}

export default App;
