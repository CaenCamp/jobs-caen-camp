<style>
    @media (min-width: 768px) {
        a .container {
            transition: top ease 250ms;
        }
        a:hover .container {
            top: -0.3125rem;
        }
        a .logo {
            transition: top ease 250ms 75ms;
        }
        a:hover .logo {
            top: 0;
        }
    }
</style>

<script>
    import { link } from 'svelte-routing';

    export let jobPosting;

    // @TODO Temporaire, à supprimer après détermination du modèle
    jobPosting = {
        ...jobPosting,
        identifier: 'a122edec-5580-4a93-aff7-fc18b41e4c37',
        jobLocationType: 'Télétravail',
        baseSalary: '30k - 34k',
        skills: [],
    };
    const detailUrl = ({ id }) => `/jobs/${id}`;
</script>

<a
    href="{detailUrl(jobPosting.id)}"
    use:link
    class="container flex relative flex-col my-5 mt-2-5 w-full
    md:max-w-screen-sm max-w-sm md:ml-15"
>

    <div
        class="logo absolute -top-2-5 left-5 md:top-2-5 md:-left-15 bg-white
        rounded-lg flex shadow-xl w-15 h-15 md:w-25 md:h-25 p-2-5 flex flex-row
        justify-center items-center z-10"
    >
        <img
            class="max-w-full max-h-full"
            src="{jobPosting.hiringOrganization.image}"
            alt="{jobPosting.hiringOrganization.name}"
        />
    </div>
    <div
        class="container bg-white rounded-lg flex shadow-lg relative flex
        flex-col z-0 top-0 p-5 pb-2-5 pr-2-5 pt-0"
    >
        <div
            class="absolute bg-red-600 w-2-5 h-2-5 m-2-5 top-0 right-0
            rounded-full"
        ></div>
        <div
            class="ml-15 md:ml-5 pl-5 h-10 md:h-5 md:mt-5 md:mb-2-5 my-1-25 flex
            flex-col justify-center"
        >
            <p
                class="leading-5 font-bold text-lg text-indigo-900 max-h-full
                truncate-2-lines mr-5"
            >
                {jobPosting.hiringOrganization.name}, {jobPosting.hiringOrganization.address.addressLocality}
            </p>
        </div>
        <div
            class="flex flex-col mt-5 mb-2-5 md:ml-5 md:pl-5 md:mt-0 md:mb-2-5"
        >
            <p class="leading-5 text-xl inline-block">
                <span class="leading-5 font-bold pr-1 text-indigo-900">
                    {jobPosting.title}
                </span>
                <span class="leading-5 text-indigo-900">H/F</span>
            </p>
        </div>
        <div class="h-0-5 w-5 bg-gray-200 flex md:hidden"></div>
        <div
            class="flex flex-col md:flex-row md:m-0 md:mb-2-5 md:ml-5 md:pl-5
            md:items-center"
        >
            <div class="flex flex-col mt-2-5 md:m-0">
                <p class="text-base text-indigo-900 whitespace-no-wrap">
                    {jobPosting.employmentType}
                </p>
            </div>
            <div class="w-0-5 h-5 bg-gray-200 md:mx-2-5 hidden md:flex"></div>
            <div class="flex flex-col">
                <p class="text-base text-indigo-900 whitespace-no-wrap">
                    {jobPosting.jobLocationType}
                </p>
            </div>
            <div class="w-0-5 h-5 bg-gray-200 md:mx-2-5 hidden md:flex"></div>
            <div class="flex flex-col mb-2-5 md:m-0">
                <p class="text-base text-indigo-900 whitespace-no-wrap">
                    {jobPosting.baseSalary}
                </p>
            </div>
            <div class="h-0-5 w-5 md:hidden bg-gray-200"></div>
        </div>
        <div
            class="flex flex-row mt-2-5 mb-1-25 md:m-0 md:ml-5 md:pl-5 md:mb-2-5
            flex-wrap pr-20"
        >
            <img
                class="h-5 w-5 mr-1-25 mb-1-25 md:mb-0"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
                alt=""
            />
            <img
                class="h-5 w-5 mr-1-25 mb-1-25 md:mb-0"
                src="https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg"
                alt=""
            />
        </div>
        <div
            class="flex flex-row absolute right-2-5 bottom-2-5 w-20 justify-end"
        >
            <p class="text-sm text-gray-500 flex">
                <i class="icofont-clock-time text-base md:text-lg mr-1"></i>
                <span class="italic">il y a 1h</span>
            </p>
        </div>
    </div>
</a>
