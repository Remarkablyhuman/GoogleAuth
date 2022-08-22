import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import * as React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    
    iosClientId: '1083979797904-o0a95r2l5ekorpu5fe410tqmvuvc0nvb.apps.googleusercontent.com',
    expoClientId: '1083979797904-iqapc5u12nc5s5r40g1b37rtbhp211le.apps.googleusercontent.com',
    androidClientId: '1083979797904-7d1u67v8vpi4os0ikce4fgt84nssuov6.apps.googleusercontent.com',
    // webClientId: '1083979797904-qph9e62mmtqprludhsavr11740nse418.apps.googleusercontent.com',
  })

  React.useEffect(()=>{
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userData = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {Authorization: `Bearer ${accessToken}`}
    });

    userData.json().then(data => {
      setUserInfo(data);
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View>
          <Image source={{uri: userInfo.picture}} />
          <Text>User: {userInfo.name}</Text>
          <Text>Email: {userInfo.email}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {showUserInfo()}
      <Button
        title={accessToken ? "Get User Data" : "Login"}
        onPress={accessToken ? getUserData : ()=>{promptAsync()}}  
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
