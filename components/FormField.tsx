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
            {/* <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}
          </FieldGroup>
)

export default FormField