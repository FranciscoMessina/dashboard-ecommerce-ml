import {
  createStyles,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Checkbox,
  Alert,
  List
} from '@mantine/core'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import axios from '../helpers/axios'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, ExclamationMark } from 'tabler-icons-react'

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

interface SignInFormData {
  email: string
  password: string
  persist: boolean
}

export function SignIn() {
  useDocumentTitle('Login - El Rio Libros')
  const { classes } = useStyles()
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [errors, setErrors] = useState<string[]>([])

  console.log(location)
  const schema = Yup.object({
    email: Yup.string()
      .required('Por favor completar!')
      .email('Por favor ingresar un email valido'),
    password: Yup.string().required('Por favor completar!')
  })

  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (values: SignInFormData) => {
    try {
      const response = await axios.post('/auth/signin', {
        email: values.email,
        password: values.password
      })

      console.log(response)

      setAuth({
        accessToken: response.data.accessToken as string,
        persist: values.persist,
        userId: response.data.id,
        roles: response.data.roles,
        meliId: response.data.meliId
      })

      navigate('/')
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

  useEffect(() => {
    localStorage.setItem('persist', `${auth.persist}`)
  }, [auth.persist])

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Bienvenido!
        </Title>
        {errors.length > 0 && (
          <Alert icon={<AlertCircle size={18} />} title="Errores" color="red" mb={20}>
            {errors.map((error, index) => (
              <Text key={index} inline>
                {error}
              </Text>
            ))}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            placeholder="hola@gmail.com"
            size="md"
            id="email"
            {...register('email')}
            error={formState.errors.email?.message}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            mt="md"
            size="md"
            id="password"
            {...register('password')}
            error={formState.errors.password?.message}
          />
          <Checkbox label="Recordame" mt="xl" size="md" {...register('persist')} />

          <Button fullWidth mt="xl" size="md" type="submit">
            Conectar
          </Button>
        </form>

        <Text align="center" mt="md">
          No tenes una cuenta?{' '}
          <Anchor component={Link} to="/auth/signup" weight={700} state={location.state}>
            Registrate
          </Anchor>
        </Text>
      </Paper>
    </div>
  )
}
