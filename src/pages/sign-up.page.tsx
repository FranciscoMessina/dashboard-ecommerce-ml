import { yupResolver } from '@hookform/resolvers/yup'
import {
  Anchor,
  Button,
  createStyles,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import axios from '../helpers/axios'
import { useAuth } from '../hooks/useAuth.js'

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: '100vh',
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage: 'url(/main-bg-img.jpg)'
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: ' 100vh',
    marginLeft: 'auto',

    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%'
    }
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))

interface SignUpFormData {
  email: string
  password: string
  passwordConfirm: string
}

export function SignUp() {
  useDocumentTitle('Registro - El Rio Libros')
  const { classes } = useStyles()
  const location = useLocation()
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [errors, setErrors] = useState<string[]>([])


  console.log(location)

  const schema = Yup.object({
    email: Yup.string()
      .required('Por favor completar!')
      .email('Por favor ingresar un email valido'),
    password: Yup.string().required('Por favor completar!'),
    passwordConfirm: Yup.string()
      .required('Por favor completar!')
      .equals([Yup.ref('password')], 'Las contraseñas no coinciden')
  })

  const {
    register,
    handleSubmit,
    formState
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = async (values: SignUpFormData) => {
    try {
      const response = await axios.post('/auth/signup', {
        email: values.email,
        password: values.password
      })
      console.log(response)

      if (response.data.accessToken) {
        setAuth({
          accessToken: response.data.accessToken,
          roles: response.data.roles,
          userId: response.data.id,
          persist: true
        })
        navigate('/')
      }
    } catch (err: any) {
      if ('response' in err) {
        const { response } = err as AxiosError
        console.log(response)

        if (response?.status === 401) {
          return setErrors(['Email o contraseña incorrectos'])
        }
      }
      console.log(err.toJSON())
    }
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Crea tu cuenta!
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            placeholder="hola@gmail.com"
            size="md"
            {...register('email')}
            error={formState.errors.email?.message}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            mt="md"
            size="md"
            {...register('password')}
            error={formState.errors.password?.message}
          />
          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Confirmar contraseña"
            mt="md"
            size="md"
            {...register('passwordConfirm')}
            error={formState.errors.passwordConfirm?.message}
          />

          <Button fullWidth mt="xl" size="md" type="submit">
            Crear cuenta
          </Button>
        </form>

        <Text align="center" mt="md">
          Ya tenes una cuenta?{' '}
          <Anchor component={Link} to="/auth/signin" weight={700} state={location.state}>
            Conectate
          </Anchor>
        </Text>
      </Paper>
    </div>
  )
}
