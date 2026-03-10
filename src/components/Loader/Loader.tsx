import css from './Loader.module.css'

interface LoaderProps {
    loader: boolean;
}

export default function Loader({ loader }: LoaderProps) {
    if (!loader) {
        return null;
    }
    return (

<p className={css.text}>Loading movies, please wait...</p>
    )
}
