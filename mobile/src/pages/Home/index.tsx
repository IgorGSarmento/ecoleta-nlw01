import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { StyleSheet, View, ImageBackground, Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  id: number
  nome: string
}

interface UFItemFormat {
  label: string
  value: string
}
interface CityItemFormat {
  key: number
  label: string
  value: string
}

const Home = () => {
  const [ufs, setUfs] = useState<UFItemFormat[]>([])
  const [cities, setCities] = useState<CityItemFormat[]>([])

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const navigation = useNavigation()

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => {
        return {
          label: uf.sigla,
          value: uf.sigla
        }
      })

      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`)
      .then(response => {
        const cityNames = response.data.map(city => {
          return {
            key: city.id,
            label: city.nome,
            value: city.nome
          }
        })

        setCities(cityNames)
      })
  }, [selectedUf])

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {/* <TextInput
            style={styles.input}
            placeholder='Digite a UF'
            value={uf}
            maxLength={2}
            autoCapitalize='characters'
            autoCorrect={false}
            onChangeText={setUf}
          />

          <TextInput
            style={styles.input}
            placeholder='Digite a cidade'
            value={city}
            autoCorrect={false}
            onChangeText={setCity}
          /> */}

          <RNPickerSelect
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="chevron-down" size={24} color="gray" />;
            }}
            placeholder={{
              label: 'Selecione uma UF...',
              value: '0',
            }}
            onValueChange={(value) => setSelectedUf(value)}
            items={ufs}
          />

          <RNPickerSelect
            style={pickerSelectStyles}
            Icon={() => {
              return <Icon name="chevron-down" size={24} color="gray" />;
            }}
            useNativeAndroidPickerStyle={false}
            placeholder={{
              label: 'Selecione uma cidade...',
              value: '0',
            }}
            onValueChange={(value) => setSelectedCity(value)}
            items={cities}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name='arrow-right' color='#FFF' size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 18,
    right: 12,
  },
  // height: 60,
  //   backgroundColor: '#FFF',
  //   borderRadius: 10,
  //   marginBottom: 8,
  //   paddingHorizontal: 24,
  //   fontSize: 16,
  inputAndroid: {
    height: 60,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    marginBottom: 8,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Home