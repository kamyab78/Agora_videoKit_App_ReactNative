/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {
  useRef,
  useState,
  useEffect,
  PropsWithChildren,
  createRef,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Switch,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  TextInput,
  ImageBackground,
  LogBox,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import ImagefirstPage from '../Asset/background.png';
import {Client, Socket} from '@heroiclabs/nakama-js';
import {Config} from '../Config/Hostaddress';
import {decode as atob, encode as btoa} from 'base-64';
import ChatIcon from '../Asset/chat.png';
import {FAB} from 'react-native-paper';
import SendIcon from '../Asset/send-message.png';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {sha256} from 'js-sha256';
import {Linking} from 'react-native';
import ManIcon from '../Asset/man.png'
const appId = '504210131f4f4b1e8c07f2929e67e793';
const channelName = 'testchannelMetaData';
const token = '';
const uid = 0;
var connectionData: any = {};
var session:any = null
const HomeScreen = (route: any) => {
  const scrollViewRef:any = useRef();
  const isDarkMode = useColorScheme() === 'dark';
  const passwordInputRef = createRef();
  const [deviceId, setdeviceId] = useState<any>(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [step, setstep] = useState(0);
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [isHost, setIsHost] = useState(true); // Client role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [videoCall, setVideoCall] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [chatShow, setchatShow] = useState(false);
  const [message, setMessage] = useState([]);
  const [userMessage, setuserMessage] = useState('');
  const [channelNameRomm,setchannelNameRoom]=useState('')
  const [messageHistory,setmessageHistory]= useState<any>([])
  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };
  useEffect(() => {
    console.log(route.route.params);
    if (route.route.params !== undefined) {
      console.log(route.route.params.username);
      console.log(route.route.params.password);
      console.log(route.route.params.channelname);
      setchannelNameRoom(route.route.params.channelname)
      // setUserName(route.route.params.username)
      // setUserPassword(route.route.params.password)

      var idHash = sha256(
        route.route.params.username + route.route.params.password,
      );
      handleSubmitPress(
        idHash,
        route.route.params.username,
        route.route.params.channelname,
      );
   
    }
  }, [route]);

  const rtcCallbacks = {
    EndCall: () => setstep(0),
  };
  const handleSubmitPress = async (
    idHash: any,
    usernameUser: any,
    channelName: any,
  ) => {
    var client = new Client('defaultkey', Config()['baseUrl'], '', true);
    try {
     session = await client.authenticateCustom(idHash, false, usernameUser);

      connectionData = {
        appId: '504210131f4f4b1e8c07f2929e67e793',
        channel: channelName,
        token: '',
      };
      ConnectTochat(
        channelName,
        session
      );
      setstep(1);
    } catch (error: any) {
      console.log(error.status);
      if (error.status === 404) {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            'کاربری با این نام کاربری و رمز عبور وجود ندارد',
            ToastAndroid.SHORT,
          );
        }
      }
      return;
    }
    // console.log(password)
    // var idHash=  sha256(userName+userPassword);

    //  var client = new Client("defaultkey",Config()["baseUrl"], "",true);
    //  try {
    //  await client.authenticateCustom(idHash,false,userName)
    //  setstep(1)
    //  } catch (error:any) {

    //    console.log(error.status)
    //    if(error.status === 404 ){
    //      if (Platform.OS === 'android') {
    //        ToastAndroid.show("کاربری با این نام کاربری و رمز عبور وجود ندارد", ToastAndroid.SHORT)
    //      }
    //    }
    //    return
    //  }
  };
 
  const ConnectTochat = async (
    roomName: any,
    session:any
  ) => {

    var client = new Client('defaultkey', Config()['baseUrl'], '', true);
    try {
      const socket = client.createSocket();
      await socket.connect(session, true);
      console.log(socket)

      var roomname = roomName;
      const persistence = true;
      const hidden = false;
      const response: any = await socket.joinChat(
        roomname,
        1,
        persistence,
        hidden,
      );
      console.log("after attempppppppppppppppppp")
      console.log(response)
      console.log("Now connected to channel id: '%o'", response.id);

      socket.onchannelmessage = (message) => {
        console.log(message)
        getHistory(message.channel_id,client)
        console.log("Received a message on channel: %o", message.channel_id);
        console.log("Message content: %o", message.content);
      };
      getHistory(response.id,client)
    } catch (error: any) {
      console.log(error);
      // if(error.status === 404 ){
      //   if (Platform.OS === 'android') {
      //     ToastAndroid.show("کاربری با این نام کاربری و رمز عبور وجود ندارد", ToastAndroid.SHORT)
      //   }
      // }
      // return
    }
  };
  async function sendMessage(){

    var data = { "message": userMessage};
    var client = new Client('defaultkey', Config()['baseUrl'], '', true);
    try {
      const socket = client.createSocket();
      await socket.connect(session, true);
      console.log(socket)

      var roomname = channelNameRomm;
      const persistence = true;
      const hidden = false;
      const response: any = await socket.joinChat(
        roomname,
        1,
        persistence,
        hidden,
      );
      console.log("after attempppppppppppppppppp")
      console.log(response)
      console.log("Now connected to channel id: '%o'", response.id);
      var channelId = response.id;
      const messageAck = await socket.writeChatMessage(channelId, data);
      console.log("message ACK")
      console.log(messageAck)
       getHistory(channelId,client)
    } catch (error: any) {
      console.log(error);
      // if(error.status === 404 ){
      //   if (Platform.OS === 'android') {
      //     ToastAndroid.show("کاربری با این نام کاربری و رمز عبور وجود ندارد", ToastAndroid.SHORT)
      //   }
      // }
      // return
    }
   
  }

 async function getHistory(channelId:any,client:any){

   try {
  
const limit = 100;
const forward = true;

const result = await client.listChannelMessages(session, channelId, limit, forward, null);
result.messages.forEach((message) => {
  var arr:any = messageHistory
  var mess = {"username":message.username,"content":message.content.message}
  arr.push(mess)
  setmessageHistory([...arr])
  console.log("%o: %o", message.username, message.content.message);
  // console.log("%o: %o", message);

});
} catch (error: any) {
  console.log(error);
  // if(error.status === 404 ){
  //   if (Platform.OS === 'android') {
  //     ToastAndroid.show("کاربری با این نام کاربری و رمز عبور وجود ندارد", ToastAndroid.SHORT)
  //   }
  // }
  // return
}
  }

  return step == 0 ? (
    <ImageBackground source={ImagefirstPage} style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                // source={require('../Image/aboutreact.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            {/* <View style={styles.SectionStyle}>
             <Text>نام کاربری</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(userName) =>
                 setUserName(userName)
               }
               placeholder="نام کاربری را وارد کنید" //dummy@abc.com
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               // keyboardType="email-address"
               returnKeyType="next"
               // onSubmitEditing={() =>
               //   passwordInputRef.current &&
               //   passwordInputRef.current.focus()
               // }
               underlineColorAndroid="#f000"
               blurOnSubmit={false}
             />
           </View> */}
            <View style={styles.SectionStyle}>
              <Text style={styles.TextTopic}>
                برای ورود به سایت گره مراجع کنید
              </Text>
              {/* <TextInput
               style={styles.inputStyle}
               onChangeText={(UserPassword) =>
                 setUserPassword(UserPassword)
               }
               placeholder="نام کاربری را وارد کنید" //12345
               placeholderTextColor="#8b9cb5"
               // keyboardType="default"
               // ref={passwordInputRef}
               onSubmitEditing={Keyboard.dismiss}
               blurOnSubmit={false}
               secureTextEntry={true}
               underlineColorAndroid="#f000"
               returnKeyType="next"
             /> */}
            </View>
            {/* {errortext != '' ? (
             <Text style={styles.errorTextStyle}>
               {errortext}
             </Text>
           ) : null} */}
            {/* <TouchableOpacity
             style={styles.buttonStyle}
             activeOpacity={0.5}
             onPress={handleSubmitPress}>
             <Text style={styles.buttonTextStyle}>وارد شو</Text>
           </TouchableOpacity> */}
            {/* <Text
             style={styles.registerTextStyle}
             onPress={() => navigation.navigate('RegisterScreen')}>
             New Here ? Register
           </Text> */}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </ImageBackground>
  ) : step == 1 ? (
    chatShow ? (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.Escbtn}
          onPress={() => setchatShow(false)}>
          <Text>X</Text>
        </TouchableOpacity>
        <ScrollView style={styles.contentview} ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
          <View style={styles.Viewcontentview}>

            {messageHistory.map((result, i)=>(
              <>
                                    <View key={i} style={styles.eachMessage}>
            <Image source={ManIcon} style={styles.avatarIcon}></Image>
            <View style={styles.ContentEachMessage}>
              <Text style={styles.usernameTxt}>{result.username}</Text>
              <Text style={styles.contentTxt}>{result.content}</Text>
            </View>
          </View>
              </>
       ))}

          </View>

        </ScrollView>

        <View style={styles.messageBox}>
          <TextInput
            style={styles.messageInput}
            keyboardType="default"
            placeholder="Type a message"
            value={userMessage}
            onChangeText={userMessage => setuserMessage(userMessage)}
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              console.log(userMessage);
              setuserMessage('');
              sendMessage()
            }}>
            <Image source={SendIcon} style={styles.iconstyle}></Image>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => setchatShow(true)}>
          <Image style={styles.iconstyle} source={ChatIcon} />
        </TouchableOpacity>
        <AgoraUIKit
          connectionData={connectionData}
          rtcCallbacks={rtcCallbacks}
        />
      </>
    )
  ) : null;
  // videoCall ? (
  // ) : (
  //   <Text onPress={() => setVideoCall(true)}>Start Call</Text>
  // );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '90%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center'},
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', paddingHorizontal: 8, color: '#0000ff'},
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    back: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'column',
    height: 80,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  TextTopic: {
    color: '#FFFFFF',
    fontSize: 25,
  },
  buttonStyle: {
    backgroundColor: '#D25684',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: 'D25684',
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#dadae8',
    direction: 'rtl',
    textAlign: 'right',
    marginTop: 15,
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  viewStepone: {
    position: 'relative',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  chatBtn: {
    position: 'absolute',
    zIndex: 1000,
    top: 0,
    right: 0,
  },
  chatView: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },

  messageBox: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.grey300,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex:11
  },
  messageInput: {
    width: '80%',
    fontSize: 14,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    color: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: Colors.deepPurple300,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 400,
    // backgroundColor:"rgba(0,0,0,0.3)",
    width: '20%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  contentview: {
    backgroundColor: 'white',

    // height:"80%",
    marginBottom: 80,
 
  },
  Viewcontentview:{
    marginTop:20,
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  Escbtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 400,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  iconstyle: {
    width: 30,
    height: 30,
  },
  eachMessage:{
    display:"flex",
    flexDirection:'row-reverse',
    backgroundColor:"rgba(0,0,0,0.1)",
    width:"90%",
    borderRadius:5,
    marginTop:20,
    height:80,
    alignItems:'center'
  },
  avatarIcon:{
    width: 50,
    height: 50,
    marginRight:10
  },
  ContentEachMessage:{
    display:'flex',
    flexDirection:'column',
    textAlign:'right',
    marginRight:10
  },
  usernameTxt:{
    textAlign:'right',

color:'blue',
fontSize:14
  },
  contentTxt:{
    textAlign:'right',

color:'black',
fontSize:23
  }
});

export default HomeScreen;
