import React, { useState } from 'react';
import {connect} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {images} from '../../../../resources';
import {Tutorials} from '../../components';

export default function TutorialsPage() {
  const navigation = useNavigation();
  const [currentImage, setCurrentImage] = useState(0)
  const onNextPress = () =>{
    if(currentImage!== images.tutorialImages.length-1)
    {
      setCurrentImage(currentImage+1)
    }
    else{
      navigation.navigate('Home', {screen: 'Dashboard'})

    }
  }
  
  const onBackPress = () =>{
    if(currentImage!== 0)
    {
      setCurrentImage(currentImage-1)
    }else{
      navigation.goBack()
    }

  }
  return <Tutorials onBackPress={onBackPress} onNextPress={onNextPress}  currentImage={currentImage} />;
}

TutorialsPage.propTypes = {};

export const TutorialsWrapper = connect(null, null)(TutorialsPage);
