import { Label } from './ui/label';
import { Input } from './ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface SocialLinkInputProps {
  id: string;
  label: string;
  icon: IconDefinition;
  iconColor?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SocialLinkInput({
  id,
  label,
  icon,
  iconColor = 'text-gray-500',
  placeholder,
  value,
  onChange,
}: SocialLinkInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className={iconColor} />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
        <FontAwesomeIcon 
          icon={icon} 
          className={`${iconColor} absolute left-3 top-1/2 transform -translate-y-1/2`}
        />
      </div>
    </div>
  );
}
