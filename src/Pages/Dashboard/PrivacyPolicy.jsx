import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from 'antd';
import { usePrivacyPolicyQuery, useUpdatePricyPolicyMutation } from "../../redux/apiSlices/privacyPolicySlice"
import toast from 'react-hot-toast';
import GradientButton from '../../components/common/GradiantButton';

const PrivacyPolicy = () => {
  const editor = useRef(null)
  const [content, setContent] = useState('');
  const {data: privacyPolicy, refetch} = usePrivacyPolicyQuery();
  const [updatePricyPolicy, {isLoading}] = useUpdatePricyPolicyMutation();


  const aboutDataSave =async () => {

    try {
      await updatePricyPolicy({id: privacyPolicy?._id, description: content}).unwrap().then(({statusCode, status, message})=>{
          if (status) {
              toast.success(message);
              refetch()
          }

      })
    } catch ({message}) {
      toast.error(message || "Something Wrong");
    }
  }


  useEffect(()=>{
    setContent(privacyPolicy?.description);
  }, [privacyPolicy])



  return (
    <div>
      <div className='mb-6'>
        <JoditEditor
          ref={editor}
          value={content}
          onChange={(newContent) => {
            setContent(newContent);
          }}
        />
      </div>

      <GradientButton onClick={aboutDataSave}>
        {isLoading ? "Updating..." : "Update"}
      </GradientButton>
    </div>
  );
};

export default PrivacyPolicy;
