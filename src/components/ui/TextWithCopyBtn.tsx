import { ActionIcon, TextInput } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { Checks, Clipboard, ClipboardCheck } from "tabler-icons-react"


interface Props {
   text: string
}

export const TextWithCopyBtn: React.FC<Props> = ({
   text
}) => {

   const clipboard = useClipboard({ timeout: 1500 })

   const clipboardBtn = <ActionIcon
      color={clipboard.copied ? 'green' : 'gray'}

      onClick={() => clipboard.copy(text)}
   >
      {clipboard.copied ?
         <ClipboardCheck size={18} />
         :
         <Clipboard size={18} />
      }
   </ActionIcon>

   return (
      <>
         <TextInput readOnly value={text} rightSection={clipboardBtn} size='xs'/>
      </>
   )
}

