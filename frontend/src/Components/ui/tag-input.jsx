
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Cross2Icon, CheckIcon, PlusIcon } from "@radix-ui/react-icons"

const tagStyles = {
  base:
    "inline-flex items-center gap-1.5 px-2 py-0.5 text-sm rounded-md transition-colors duration-150",
  colors: {
    blue:
      "bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/30 dark:hover:border-blue-600/50",
    purple:
      "bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/30 dark:hover:border-purple-600/50",
    green:
      "bg-green-50 text-green-700 border border-green-200 hover:border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/30 dark:hover:border-green-600/50"
  }
}

export function TagInput({
  tags,
  setTags,
  suggestions = [],
  maxTags = 25,
  label,
  placeholder = "Add tags...",
  error,
  className
}) {
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const filteredSuggestions = suggestions
    .filter(
      suggestion =>
        suggestion.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
        !tags.some(tag => tag.id === suggestion.id)
    )
    .slice(0, 5)

  const canAddNewTag =
    input.length > 0 &&
    !suggestions.some(s => s.label.toLowerCase() === input.toLowerCase())

  function handleKeyDown(e) {
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      setTags(tags.slice(0, -1))
    } else if (e.key === "Enter" && input) {
      e.preventDefault()
      if (isOpen && filteredSuggestions[selectedIndex]) {
        setTags([...tags, filteredSuggestions[selectedIndex]])
        setInput("")
        setIsOpen(false)
      } else if (canAddNewTag) {
        const colorKeys = Object.keys(tagStyles.colors)
        const randomColor =
          tagStyles.colors[
            colorKeys[Math.floor(Math.random() * colorKeys.length)]
          ]
        setTags([...tags, { id: input, label: input, color: randomColor }])
        setInput("")
        setIsOpen(false)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("w-full space-y-2",className)} ref={containerRef}>
      {label && (
        <label
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor={label}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "min-h-[3rem] sm:min-h-[2.5rem] p-2 sm:p-1.5",
          "rounded-lg border",
          "border-zinc-300 dark:border-zinc-700",
          "bg-white dark:bg-transparent",
          "focus-within:ring-2 focus-within:ring-indigo-500/30 dark:focus-within:ring-indigo-400/30",
          "flex items-center flex-row flex-wrap gap-2 sm:gap-1.5 relative"
        )}
      >
        {tags.map((tag,index) => (
          <span
            key={tag.id}
            className={cn(
              tagStyles.base,
              "text-base sm:text-sm py-1 sm:py-0.5",
              tag.color || (index%3==0?tagStyles.colors.blue:index%3==1?tagStyles.colors.purple:tagStyles.colors.green)
            )}
          >
            {tag.label}
            <button
              type="button"
              onClick={() => setTags(tags.filter(t => t.id !== tag.id))}
              className={cn(
                "text-current/60 hover:text-current transition-colors",
                "p-1 sm:p-0"
              )}
            >
              <Cross2Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setIsOpen(true)
            setSelectedIndex(0)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cn(
            "flex-1 min-w-[140px] sm:min-w-[120px] bg-transparent",
            "h-8 sm:h-7",
            "text-base sm:text-sm",
            "text-zinc-900 dark:text-zinc-100",
            "placeholder:text-zinc-500 dark:placeholder:text-zinc-400",
            "focus:outline-none"
          )}
        />

        {isOpen && (input || filteredSuggestions.length > 0) && (
          <div
            className={cn(
              "absolute left-0 right-0 top-full mt-1 z-50",
              "max-h-[60vh] sm:max-h-[300px] overflow-y-auto",
              "bg-white dark:bg-zinc-900",
              "border border-zinc-300 dark:border-zinc-700",
              "rounded-lg shadow-lg dark:shadow-zinc-950/50",
              "overflow-hidden"
            )}
          >
            <div className="px-2 py-1.5 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Add a skill or technology
              </span>
            </div>
            <div className="p-2 sm:p-1.5 flex flex-wrap gap-2 sm:gap-1.5">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  type="button"
                  key={suggestion.id}
                  onClick={() => {
                    setTags([...tags, suggestion])
                    setInput("")
                    setIsOpen(false)
                  }}
                  className={cn(
                    tagStyles.base,
                    selectedIndex === index
                      ? tagStyles.colors.blue
                      : "bg-zinc-50 text-zinc-700 border border-zinc-300 hover:border-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                  )}
                >
                  {suggestion.label}
                  {selectedIndex === index && (
                    <CheckIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
              {canAddNewTag && (
                <button
                  type="button"
                  onClick={() => {
                    const colorKeys = Object.keys(tagStyles.colors)
                    const randomColor =
                      tagStyles.colors[
                        colorKeys[Math.floor(Math.random() * colorKeys.length)]
                      ]
                    setTags([
                      ...tags,
                      { id: input, label: input, color: randomColor }
                    ])
                    setInput("")
                    setIsOpen(false)
                  }}
                  className={cn(
                    tagStyles.base,
                    selectedIndex === filteredSuggestions.length
                      ? tagStyles.colors.blue
                      : "bg-zinc-50 text-zinc-700 border border-zinc-300 hover:border-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                  )}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Create "{input}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
