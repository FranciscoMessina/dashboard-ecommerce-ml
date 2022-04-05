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
import { useForm, yupResolver } from '@mantine/form'
import { useDocumentTitle } from '@mantine/hooks'
import * as Yup from 'yup'
import axios from '../helpers/axios'

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

export function SignUp() {
  useDocumentTitle('Registro - El Rio Libros')
  const { classes } = useStyles()

  const submit = async (values: typeof form.values) => {
    const response = await axios.post('/auth/register', {
      email: values.email,
      password: values.password
    })
    console.log(response)

    if (response.data.logged) {
      // if (typeof router.query.next === 'string') {
      //   router.push(router.query.next)
      // } else {
      //   router.push('/')
      // }
    }
  }

  const schema = Yup.object({
    email: Yup.string()
      .required('Por favor completar!')
      .email('Por favor ingresar un email valido'),
    password: Yup.string().required('Por favor completar!'),
    passwordConfirm: Yup.string().equals([Yup.ref('password')], 'Las contraseñas no coinciden')
  })

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: ''
    },
    schema: yupResolver(schema)
  })

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
          Crea tu cuenta!
        </Title>

        <form onSubmit={form.onSubmit(submit)}>
          <TextInput
            label="Email"
            placeholder="hola@gmail.com"
            size="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Confirmar contraseña"
            mt="md"
            size="md"
            {...form.getInputProps('passwordConfirm')}
          />

          <Button fullWidth mt="xl" size="md" type="submit">
            Conectar
          </Button>
        </form>

        <Text align="center" mt="md">
          Ya tenes una cuenta?{' '}
          <Anchor href="/auth/login" weight={700}>
            Conectate
          </Anchor>
        </Text>
      </Paper>
    </div>
  )
}
