import React from 'react'
import { FieldGroup , FieldContent , FieldDescription , Field , FieldError , FieldLabel , FieldSeparator , FieldLegend , FieldSet , FieldTitle } from './ui/field'
import { Input } from './ui/input'
import { Control, Controller, FieldValues, Path  } from 'react-hook-form'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './ui/form'

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name : Path<T>
    label : string
    placeholder? : string
    type? : 'text' | 'email' | 'password' | 'file' 
}

const FormField = <T extends FieldValues>( { control , name , label , placeholder , type } : FormFieldProps<T>) => (
    <FieldGroup>
        <Controller
            name={name}
            control={control}
            render={ ({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input className='input' placeholder={placeholder} {...field} type={type} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )} 
        >

        </Controller>
          </FieldGroup>
)

export default FormField