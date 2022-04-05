import {
  createStyles,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Checkbox
} from '@mantine/core'
import { yupResolver, useForm } from '@mantine/form'
import { AxiosError } from 'axios'
import axios from '../helpers/axios'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@mantine/hooks'
import { useEffect } from 'react'

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

export function SignIn() {
  const { classes } = useStyles()
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  useDocumentTitle('Login - El Rio Libros')
  const submit = async (values: typeof form.values) => {
    try {
      const response = await axios.post(
        '/auth/login',
        {
          email: values.email,
          password: values.password
        },
        { withCredentials: true }
      )

      console.log(response)

      setAuth({
        accessToken: response.data.accessToken as string,
        persist: values.persist,
        user: response.data.id,
        roles: response.data.roles
      })

      navigate('/')
    } catch (err: any) {
      if ('response' in err) {
        const { response } = err as AxiosError
        console.log(response)

        if (response?.status === 401) {
          return form.setErrors({
            email: response?.data?.errors?.email?.msg,
            password: response?.data?.errors?.password?.msg
          })
        }
      }
      console.log(err.toJSON())
    }
  }

  useEffect(() => {
    localStorage.setItem('persist', `${auth.persist}`)
  }, [auth.persist])

  const schema = Yup.object({
    email: Yup.string()
      .required('Por favor completar!')
      .email('Por favor ingresar un email valido'),
    password: Yup.string().required('Por favor completar!')
  })

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      persist: true
    },
    schema: yupResolver(schema)
  })

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Bienvenido!
        </Title>

        <form onSubmit={form.onSubmit(submit)}>
          <TextInput
            label="Email"
            placeholder="hola@gmail.com"
            size="md"
            id="email"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            mt="md"
            size="md"
            id="password"
            {...form.getInputProps('password')}
          />
          <Checkbox
            label="Recordame"
            mt="xl"
            size="md"
            {...form.getInputProps('persist', { type: 'checkbox' })}
          />

          <Button fullWidth mt="xl" size="md" type="submit">
            Conectar
          </Button>
        </form>

        <Text align="center" mt="md">
          No tenes una cuenta?{' '}
          <Anchor href="/auth/register" weight={700}>
            Registrate
          </Anchor>
        </Text>
      </Paper>
    </div>
  )
}
