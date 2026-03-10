import css from './ErrorMessage.module.css'

interface ErrorMessageProps {   
    error: boolean;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
    if (!error) {
        return null;
    }
    return (
<p className={css.text}>There was an error, please try again...</p>
    )
}
