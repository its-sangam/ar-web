import * as yup from 'yup';

export const MusicSchema = yup.object().shape({
    title: yup.string().required('Music title is required'),
    album_name: yup.string().required('Album name is required'),
    genre: yup.string().oneOf(['rnb', 'country', 'classic', 'rock', 'jazz'], 'Invalid genre').required('Genre is required')
});
