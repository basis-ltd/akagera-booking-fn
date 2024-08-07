import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  onBlur?: () => void;
  height?: string
}

const Editor = ({
  onChange,
  defaultValue,
  placeholder,
  onBlur,
  height
}: EditorProps) => {

  const [editorValue, setEditorValue] = useState(defaultValue || '');

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
    onChange && onChange(value);
  };

  return (
    <label className="w-full flex flex-col gap-2">
      <ReactQuill
        value={editorValue}
        style={{
          height: height || '140px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
        placeholder={placeholder}
        modules={{
          toolbar: {
            container: [
              [{ header: [2, 3, 4, false] }],
              ['bold', 'italic', 'underline', 'blockquote'],
              [{ color: [] }],
              [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
              ],
              ['link', 'image'],
              ['clean'],
            ],
          },
          clipboard: {
            matchVisual: true,
          },
        }}
        formats={[
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          'image',
          'color',
          'clean',
        ]}
        onChange={handleEditorChange}
        onBlur={onBlur}
        theme="snow"
      />
    </label>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
};

export default Editor;
